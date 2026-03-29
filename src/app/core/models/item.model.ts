export interface ItemImageResponse {
  id: string;
  imageUrl: string;
  isMain: boolean;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  itemCondition: string;
  pricePerDay: number;
  deposit: number;
  minRentalDays: number;
  city: string;
  latitude: number;
  longitude: number;
  available: boolean;
  categoryId: string;
  categoryName: string;
  ownerId: string;
  ownerName: string;
  images: ItemImageResponse[];
}
