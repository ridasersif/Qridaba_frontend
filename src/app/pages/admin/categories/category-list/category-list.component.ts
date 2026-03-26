import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        this.categories = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (err) => {
          console.error('Failed to delete category', err);
        }
      });
    }
  }
}
