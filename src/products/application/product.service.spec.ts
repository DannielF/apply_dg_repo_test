import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../src/products/application/product.service';
import { ContentfulService } from '../../../src/products/infrastructure/contentful.service';
import { ProductRepository } from '../../../src/products/domain/product.repository';
import { Product } from '../../../src/products/domain/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;
  let contentfulService: jest.Mocked<ContentfulService>;

  const mockProduct: Product = {
    id: '1',
    contentfulId: 'contentful-1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'Test Category',
    imageUrl: 'https://example.com/image.jpg',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByContentfulId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      count: jest.fn(),
      countDeleted: jest.fn(),
      countByPriceRange: jest.fn(),
      countByDateRange: jest.fn(),
      bulkUpsert: jest.fn(),
    };

    const mockContentfulService = {
      fetchProducts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'PRODUCT_REPOSITORY',
          useValue: mockProductRepository,
        },
        {
          provide: ContentfulService,
          useValue: mockContentfulService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get('PRODUCT_REPOSITORY');
    contentfulService = module.get(ContentfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockResult = {
        products: [mockProduct],
        total: 1,
      };

      productRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(1, 5);

      expect(result).toEqual({
        products: [mockProduct],
        total: 1,
        totalPages: 1,
        currentPage: 1,
      });
      expect(productRepository.findAll).toHaveBeenCalledWith(1, 5, undefined);
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      productRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findById('1');

      expect(result).toEqual(mockProduct);
      expect(productRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow('Product with ID 1 not found');
    });

    it('should throw NotFoundException when product is deleted', async () => {
      const deletedProduct = { ...mockProduct, isDeleted: true };
      productRepository.findById.mockResolvedValue(deletedProduct);

      await expect(service.findById('1')).rejects.toThrow('Product with ID 1 not found');
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete a product', async () => {
      productRepository.softDelete.mockResolvedValue(true);

      await service.deleteProduct('1');

      expect(productRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepository.softDelete.mockResolvedValue(false);

      await expect(service.deleteProduct('1')).rejects.toThrow('Product with ID 1 not found');
    });
  });

  describe('manualSync', () => {
    it('should sync products from Contentful', async () => {
      const contentfulProducts = [
        {
          contentfulId: 'contentful-1',
          name: 'Test Product',
          isDeleted: false,
        },
      ];

      const syncedProducts = [mockProduct];

      contentfulService.fetchProducts.mockResolvedValue(contentfulProducts as any);
      productRepository.bulkUpsert.mockResolvedValue(syncedProducts);

      const result = await service.manualSync();

      expect(result).toEqual({
        message: 'Products synced successfully',
        syncedCount: 1,
      });
      expect(contentfulService.fetchProducts).toHaveBeenCalled();
      expect(productRepository.bulkUpsert).toHaveBeenCalledWith(contentfulProducts);
    });
  });
});
