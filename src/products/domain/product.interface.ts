export interface Product {
  id: string;
  contentfulId: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
