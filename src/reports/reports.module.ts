import { Module } from '@nestjs/common';
import { ReportsController } from './presentation/reports.controller';
import { ReportsService } from './application/reports.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
