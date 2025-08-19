import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductRepository, ProductFilters } from '../domain/product.repository';
import { Product } from '../domain/product.interface';
import { ContentfulService } from '../infrastructure/contentful.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: ProductRepository,
    private readonly contentfulService: ContentfulService,
  ) {}

  async findAll(page: number = 1, limit: number = 5, filters?: ProductFilters): Promise<{ products: Product[]; total: number; totalPages: number; currentPage: number }> {
    const { products, total } = await this.productRepository.findAll(page, limit, filters);
    const totalPages = Math.ceil(total / limit);
    
    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product || product.isDeleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.logger.log(`Product ${id} has been soft deleted`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncProductsFromContentful(): Promise<void> {
    try {
      this.logger.log('Starting scheduled product sync from Contentful...');
      
      const contentfulProducts = await this.contentfulService.fetchProducts();
      
      if (contentfulProducts.length === 0) {
        this.logger.warn('No products found in Contentful');
        return;
      }

      const syncedProducts = await this.productRepository.bulkUpsert(contentfulProducts);
      
      this.logger.log(`Successfully synced ${syncedProducts.length} products from Contentful`);
    } catch (error) {
      this.logger.error('Error syncing products from Contentful:', error.message);
    }
  }

  async manualSync(): Promise<{ message: string; syncedCount: number }> {
    try {
      this.logger.log('Starting manual product sync from Contentful...');
      
      const contentfulProducts = await this.contentfulService.fetchProducts();
      const syncedProducts = await this.productRepository.bulkUpsert(contentfulProducts);
      
      this.logger.log(`Manually synced ${syncedProducts.length} products from Contentful`);
      
      return {
        message: 'Products synced successfully',
        syncedCount: syncedProducts.length,
      };
    } catch (error) {
      this.logger.error('Error in manual sync:', error.message);
      throw error;
    }
  }

  // Methods for reports
  async getTotalProductCount(): Promise<number> {
    return this.productRepository.count();
  }

  async getDeletedProductCount(): Promise<number> {
    return this.productRepository.countDeleted();
  }

  async getProductCountByPrice(hasPrice: boolean): Promise<number> {
    return this.productRepository.countByPriceRange(hasPrice);
  }

  async getProductCountByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.productRepository.countByDateRange(startDate, endDate);
  }
}
