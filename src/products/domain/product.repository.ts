import { Product } from './product.interface';

export interface ProductRepository {
  findAll(page: number, limit: number, filters?: ProductFilters): Promise<{ products: Product[]; total: number }>;
  findById(id: string): Promise<Product | null>;
  findByContentfulId(contentfulId: string): Promise<Product | null>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  softDelete(id: string): Promise<boolean>;
  count(): Promise<number>;
  countDeleted(): Promise<number>;
  countByPriceRange(hasPrice: boolean): Promise<number>;
  countByDateRange(startDate: Date, endDate: Date): Promise<number>;
  bulkUpsert(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Product[]>;
}

export interface ProductFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  hasPrice?: boolean;
}
