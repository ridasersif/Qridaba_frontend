import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../../core/services/category.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Category } from '../../../../core/models/category.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  categoryId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;

  // Icon picker state
  showIconDropdown = false;
  iconsLoading = false;
  apiError: string | null = null;
  searchTerm = '';
  filteredIcons: string[] = []; // No static icons at all per user request

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      icon: ['']
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId && this.categoryId !== 'new') {
      this.isEditMode = true;
      this.loadCategory(this.categoryId);
    }

    // Subscribe to icon value changes for live API filtering
    this.categoryForm.get('icon')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.apiError = null;
        this.searchTerm = term || '';
        
        if (!term || term.trim().length === 0) {
          this.filteredIcons = [];
          return of({ icons: [] });
        }
        
        // If they already selected one, avoid refetching
        if (term.includes(':')) {
          this.filteredIcons = [term];
          return of({ icons: [] });
        }

        this.iconsLoading = true;
        
        // Search globally across all collections
        return this.http.get<any>(`https://api.iconify.design/search?query=${encodeURIComponent(term)}&limit=100`).pipe(
          catchError((err) => {
            console.error('Iconify API Error Data:', err);
            this.apiError = "API Error: Could not connect to the Iconify API! Check console.";
            return of({ icons: [] });
          })
        );
      })
    ).subscribe((res: any) => {
      this.iconsLoading = false;
      if (res && res.icons && res.icons.length > 0) {
        // Return exactly what Iconify provided
        this.filteredIcons = res.icons;
        this.apiError = null;
      } else if (this.searchTerm && !this.searchTerm.includes(':') && !this.apiError) {
        this.filteredIcons = [];
        this.apiError = `No icons found for "${this.searchTerm}"`;
      }
    });
  }

  selectIcon(icon: string): void {
    this.categoryForm.patchValue({ icon }, { emitEvent: false }); // Avoid double filtering
    this.showIconDropdown = false;
    this.apiError = null;
  }

  toggleDropdown(show: boolean): void {
    setTimeout(() => {
      this.showIconDropdown = show;
    }, 200);
  }

  get currentIcon(): string {
    return this.categoryForm.get('icon')?.value || 'lucide:tag';
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.categoryService.getById(id).subscribe({
      next: (response: ApiResponse<Category>) => {
        const cat = response.data;
        if (cat) {
            this.categoryForm.patchValue({
              name: cat.name,
              description: cat.description,
              icon: cat.icon || ''
            }, { emitEvent: false });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load category', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;
    
    this.submitting = true;
    const formData = this.categoryForm.value;
    
    if (this.isEditMode && this.categoryId) {
      this.categoryService.update(this.categoryId, formData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error('Failed to update category', err);
          this.submitting = false;
        }
      });
    } else {
      this.categoryService.create(formData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error('Failed to create category', err);
          this.submitting = false;
        }
      });
    }
  }
}
