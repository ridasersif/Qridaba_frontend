import { Item } from "./item.model";

export interface FavoriteRequest {
  userId: string;
  itemId: string;
}

export interface FavoriteResponse {
  id: string; // The favorite entry ID
  userId: string;
  item: Item; 
  createdAt: string;
}
