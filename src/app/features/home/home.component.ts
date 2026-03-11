import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Category {
  name: string;
  icon: string;
}

interface Item {
  id: number;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  owner: {
    name: string;
    avatar: string;
  };
  isVeryPopular?: boolean;
  isPopular?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  categories: Category[] = [
    { name: 'Cleaning & Tools', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Photography', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Computers', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Electronics', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Music Gear', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Outdoor', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  recentSearches = ['Pressure Washer', 'DJ Set', 'MacBook Pro', 'Mountain Bike'];

  activeItems: Item[] = [
    {
      id: 1,
      title: 'Sony Alpha a7 III Mirrorless Camera',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      price: 45,
      rating: 4.9,
      reviews: 128,
      location: 'East London',
      owner: { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex' },
      isVeryPopular: true
    },
    {
      id: 2,
      title: 'DJI Mavic 3 Pro Drone',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop',
      price: 65,
      rating: 5.0,
      reviews: 42,
      location: 'Central London',
      owner: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      isVeryPopular: true
    },
    {
      id: 3,
      title: 'Pioneer CDJ-3000 Professional Deck',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      price: 55,
      rating: 4.8,
      reviews: 96,
      location: 'Manchester',
      owner: { name: 'James', avatar: 'https://i.pravatar.cc/150?u=james' },
      isPopular: true
    },
    {
      id: 4,
      title: 'Trek Rail 9.8 Electric Mountain Bike',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop',
      price: 85,
      rating: 4.9,
      reviews: 15,
      location: 'Surrey Hills',
      owner: { name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=mike' },
      isPopular: true
    },
    {
      id: 5,
      title: 'Apple MacBook Pro M3 Max 16"',
      image: 'https://images.unsplash.com/photo-1517336712614-53a47927c8d9?q=80&w=1000&auto=format&fit=crop',
      price: 120,
      rating: 5.0,
      reviews: 8,
      location: 'Cambridge',
      owner: { name: 'Emily', avatar: 'https://i.pravatar.cc/150?u=emily' }
    }
  ];
}
