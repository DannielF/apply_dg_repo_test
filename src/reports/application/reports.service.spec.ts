import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../../../src/reports/application/reports.service';
import { ProductService } from '../../../src/products/application/product.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const mockProductService = {
      getTotalProductCount: jest.fn(),
      getDeletedProductCount: jest.fn(),
      getProductCountByPrice: jest.fn(),
      getProductCountByDateRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    productService = module.get(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeletedProductsReport', () => {
    it('should return deleted products report', async () => {
      productService.getTotalProductCount.mockResolvedValue(100);
      productService.getDeletedProductCount.mockResolvedValue(20);

      const result = await service.getDeletedProductsReport();

      expect(result).toEqual({
        totalProducts: 100,
        deletedProducts: 20,
        deletedPercentage: 20,
        nonDeletedPercentage: 80,
      });
    });

    it('should handle zero products', async () => {
      productService.getTotalProductCount.mockResolvedValue(0);
      productService.getDeletedProductCount.mockResolvedValue(0);

      const result = await service.getDeletedProductsReport();

      expect(result).toEqual({
        totalProducts: 0,
        deletedProducts: 0,
        deletedPercentage: 0,
        nonDeletedPercentage: 0,
      });
    });
  });

  describe('getPriceAnalysisReport', () => {
    it('should return price analysis report', async () => {
      productService.getTotalProductCount.mockResolvedValue(100);
      productService.getDeletedProductCount.mockResolvedValue(10);
      productService.getProductCountByPrice.mockImplementation((hasPrice) => 
        hasPrice ? Promise.resolve(70) : Promise.resolve(20)
      );

      const result = await service.getPriceAnalysisReport();

      expect(result).toEqual({
        totalNonDeletedProducts: 90,
        productsWithPrice: 70,
        productsWithoutPrice: 20,
        withPricePercentage: 77.78,
        withoutPricePercentage: 22.22,
      });
    });
  });

  describe('getCustomReport', () => {
    it('should return custom report', async () => {
      productService.getTotalProductCount.mockResolvedValue(100);
      productService.getProductCountByDateRange.mockResolvedValue(15);

      const result = await service.getCustomReport();

      expect(result).toEqual({
        title: 'Product Activity Report',
        description: 'Analysis of product creation activity over the last 30 days',
        totalProducts: 100,
        recentProducts: 15,
        averageProductsPerDay: 0.5,
        generatedAt: expect.any(String),
      });
    });
  });
});
