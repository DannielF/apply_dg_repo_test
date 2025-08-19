import { Injectable, Inject } from '@nestjs/common';
import { ProductService } from '../../products/application/product.service';

export interface DeletedProductsReport {
  totalProducts: number;
  deletedProducts: number;
  deletedPercentage: number;
  nonDeletedPercentage: number;
}

export interface PriceAnalysisReport {
  totalNonDeletedProducts: number;
  productsWithPrice: number;
  productsWithoutPrice: number;
  withPricePercentage: number;
  withoutPricePercentage: number;
}

export interface DateRangeReport {
  startDate: string;
  endDate: string;
  totalProducts: number;
  productsInRange: number;
  percentageInRange: number;
}

export interface CustomReport {
  title: string;
  description: string;
  totalProducts: number;
  recentProducts: number; // Products created in last 30 days
  averageProductsPerDay: number;
  generatedAt: string;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async getDeletedProductsReport(): Promise<DeletedProductsReport> {
    const totalProducts = await this.productService.getTotalProductCount();
    const deletedProducts = await this.productService.getDeletedProductCount();
    
    const deletedPercentage = totalProducts > 0 ? (deletedProducts / totalProducts) * 100 : 0;
    const nonDeletedPercentage = totalProducts > 0 ? ((totalProducts - deletedProducts) / totalProducts) * 100 : 0;

    return {
      totalProducts,
      deletedProducts,
      deletedPercentage: Math.round(deletedPercentage * 100) / 100,
      nonDeletedPercentage: Math.round(nonDeletedPercentage * 100) / 100,
    };
  }

  async getPriceAnalysisReport(): Promise<PriceAnalysisReport> {
    const totalProducts = await this.productService.getTotalProductCount();
    const deletedProducts = await this.productService.getDeletedProductCount();
    const totalNonDeletedProducts = totalProducts - deletedProducts;
    
    const productsWithPrice = await this.productService.getProductCountByPrice(true);
    const productsWithoutPrice = await this.productService.getProductCountByPrice(false);
    
    const withPricePercentage = totalNonDeletedProducts > 0 ? (productsWithPrice / totalNonDeletedProducts) * 100 : 0;
    const withoutPricePercentage = totalNonDeletedProducts > 0 ? (productsWithoutPrice / totalNonDeletedProducts) * 100 : 0;

    return {
      totalNonDeletedProducts,
      productsWithPrice,
      productsWithoutPrice,
      withPricePercentage: Math.round(withPricePercentage * 100) / 100,
      withoutPricePercentage: Math.round(withoutPricePercentage * 100) / 100,
    };
  }

  async getDateRangeReport(startDate: Date, endDate: Date): Promise<DateRangeReport> {
    const totalProducts = await this.productService.getTotalProductCount();
    const deletedProducts = await this.productService.getDeletedProductCount();
    const totalNonDeletedProducts = totalProducts - deletedProducts;
    
    const productsInRange = await this.productService.getProductCountByDateRange(startDate, endDate);
    const percentageInRange = totalNonDeletedProducts > 0 ? (productsInRange / totalNonDeletedProducts) * 100 : 0;

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalProducts: totalNonDeletedProducts,
      productsInRange,
      percentageInRange: Math.round(percentageInRange * 100) / 100,
    };
  }

  async getCustomReport(): Promise<CustomReport> {
    const totalProducts = await this.productService.getTotalProductCount();
    
    // Get products created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const now = new Date();
    
    const recentProducts = await this.productService.getProductCountByDateRange(thirtyDaysAgo, now);
    const averageProductsPerDay = Math.round((recentProducts / 30) * 100) / 100;

    return {
      title: 'Product Activity Report',
      description: 'Analysis of product creation activity over the last 30 days',
      totalProducts,
      recentProducts,
      averageProductsPerDay,
      generatedAt: new Date().toISOString(),
    };
  }
}
