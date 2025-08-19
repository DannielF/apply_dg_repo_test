import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, FindManyOptions } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ProductRepository, ProductFilters } from '../domain/product.repository';
import { Product } from '../domain/product.interface';
import { ProductEntity } from './product.entity';

@Injectable()
export class MongoProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: MongoRepository<ProductEntity>,
  ) {}

  async findAll(page: number, limit: number, filters?: ProductFilters): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = { isDeleted: false };

    if (filters?.name) {
      where.name = new RegExp(filters.name, 'i');
    }
    if (filters?.category) {
      where.category = new RegExp(filters.category, 'i');
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.$lte = filters.maxPrice;
      }
    }
    if (filters?.hasPrice !== undefined) {
      if (filters.hasPrice) {
        where.price = { $ne: null, $exists: true };
      } else {
        where.$or = [
          { price: null },
          { price: { $exists: false } }
        ];
      }
    }

    const [entities, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    } as FindManyOptions<ProductEntity>);

    const products = entities.map(this.mapEntityToProduct);
    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });
    return entity ? this.mapEntityToProduct(entity) : null;
  }

  async findByContentfulId(contentfulId: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { contentfulId } as any,
    });
    return entity ? this.mapEntityToProduct(entity) : null;
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const entity = this.productRepository.create({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedEntity = await this.productRepository.save(entity);
    return this.mapEntityToProduct(savedEntity);
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updateResult = await this.productRepository.updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: { ...product, updatedAt: new Date() } },
    );
    
    if (updateResult.matchedCount === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const updateResult = await this.productRepository.updateOne(
      { _id: new ObjectId(id) } as any,
      { $set: { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() } },
    );
    
    return updateResult.matchedCount > 0;
  }

  async count(): Promise<number> {
    return this.productRepository.count({});
  }

  async countDeleted(): Promise<number> {
    return this.productRepository.count({ isDeleted: true } as any);
  }

  async countByPriceRange(hasPrice: boolean): Promise<number> {
    const where = hasPrice 
      ? { price: { $ne: null, $exists: true }, isDeleted: false }
      : { $or: [{ price: null }, { price: { $exists: false } }], isDeleted: false };
    
    return this.productRepository.count(where as any);
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.productRepository.count({
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: false,
    } as any);
  }

  async bulkUpsert(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Product[]> {
    const results: Product[] = [];
    
    for (const productData of products) {
      const existing = await this.findByContentfulId(productData.contentfulId);
      
      if (existing) {
        const updated = await this.update(existing.id, productData);
        if (updated) {
          results.push(updated);
        }
      } else {
        const created = await this.create(productData);
        results.push(created);
      }
    }
    
    return results;
  }

  private mapEntityToProduct(entity: ProductEntity): Product {
    return {
      id: entity.id,
      contentfulId: entity.contentfulId,
      name: entity.name,
      description: entity.description,
      price: entity.price ? parseFloat(entity.price.toString()) : undefined,
      category: entity.category,
      imageUrl: entity.imageUrl,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
