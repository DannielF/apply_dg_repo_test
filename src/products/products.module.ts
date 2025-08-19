import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './presentation/products.controller';
import { ProductService } from './application/product.service';
import { MongoProductRepository } from './infrastructure/mongo-product.repository';
import { ContentfulService } from './infrastructure/contentful.service';
import { ProductEntity } from './infrastructure/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductService,
    ContentfulService,
    {
      provide: 'PRODUCT_REPOSITORY',
      useClass: MongoProductRepository,
    },
  ],
  exports: [ProductService, 'PRODUCT_REPOSITORY'],
})
export class ProductsModule {}
