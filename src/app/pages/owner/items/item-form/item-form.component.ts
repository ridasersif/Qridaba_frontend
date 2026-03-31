import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../../core/services/item.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  itemId: string | null = null;
  isEditMode = false;
  
  loading = false;
  submitting = false;

  categories: Category[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      brand: [''],
      model: [''],
      itemCondition: ['', Validators.required],
      pricePerDay: ['', [Validators.required, Validators.min(0)]],
      deposit: ['', [Validators.min(0)]],

      city: ['', Validators.required],
      categoryId: ['', Validators.required],
      latitude: [0],
      longitude: [0]
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId && this.itemId !== 'new') {
      this.isEditMode = true;
      this.loadItemData(this.itemId);
    }
  }

  fetchCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
      }
    });
  }

  loadItemData(id: string) {
    this.loading = true;
    this.itemService.getItemById(id).subscribe({
      next: (res) => {
        const item = res.data;
        if (item) {
          this.itemForm.patchValue({
            title: item.title,
            description: item.description,
            brand: item.brand,
            model: item.model,
            itemCondition: item.itemCondition,
            pricePerDay: item.pricePerDay,
            deposit: item.deposit,

            city: item.city,
            categoryId: item.categoryId,
            latitude: item.latitude || 0,
            longitude: item.longitude || 0
          });
          
          if (item.images && item.images.length > 0) {
            this.previewUrls = item.images.map(img => img.imageUrl);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading item:', err);
        this.loading = false;
      }
    });
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        this.selectedFiles.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const itemData = this.itemForm.value;
    const jsonPayload = JSON.stringify(itemData);

    if (this.isEditMode && this.itemId) {
      // Not handling full image replace in edit yet, just info update.
      this.itemService.updateItem(this.itemId, jsonPayload, this.selectedFiles).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      this.itemService.createItem(jsonPayload, this.selectedFiles).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }


  private handleSuccess() {
    this.submitting = false;
    this.router.navigate(['/owner/items']);
  }
 

  private handleError(err: any) {
    console.error('Submission failed!', err);
    this.submitting = false;
    let errMsg = err.error?.message || err.message || 'Unknown error';
    alert(`Failed to save item. Status: ${err.status}\nMessage: ${errMsg}`);
  }
}