import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemService } from '../../core/services/item.service';
import { CategoryService } from '../../core/services/category.service';
import { Item } from '../../core/models/item.model';
import { Category } from '../../core/models/category.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-category-items',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.scss']
})
export class CategoryItemsComponent implements OnInit {
  categoryId: string | null = null;
  category: Category | null = null;
  items: Item[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.fetchCategoryDetails();
        this.fetchCategoryItems();
      }
    });
  }

  fetchCategoryDetails() {
    this.categoryService.getById(this.categoryId!).subscribe({
      next: (res) => {
        this.category = res.data || null;
      },
      error: (err) => {
        console.error('Failed to load category', err);
      }
    });
  }

  fetchCategoryItems() {
    this.loading = true;
    this.itemService.getItemsByCategory(this.categoryId!).subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load items by category', err);
        this.loading = false;
      }
    });
  }
}
