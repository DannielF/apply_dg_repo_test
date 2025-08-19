import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DateRangeQueryDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)', example: '2024-12-31' })
  @IsDateString()
  endDate: string;
}

export class DeletedProductsReportDto {
  @ApiProperty({ description: 'Total number of products' })
  totalProducts: number;

  @ApiProperty({ description: 'Number of deleted products' })
  deletedProducts: number;

  @ApiProperty({ description: 'Percentage of deleted products' })
  deletedPercentage: number;

  @ApiProperty({ description: 'Percentage of non-deleted products' })
  nonDeletedPercentage: number;
}

export class PriceAnalysisReportDto {
  @ApiProperty({ description: 'Total non-deleted products' })
  totalNonDeletedProducts: number;

  @ApiProperty({ description: 'Products with price' })
  productsWithPrice: number;

  @ApiProperty({ description: 'Products without price' })
  productsWithoutPrice: number;

  @ApiProperty({ description: 'Percentage with price' })
  withPricePercentage: number;

  @ApiProperty({ description: 'Percentage without price' })
  withoutPricePercentage: number;
}

export class DateRangeReportDto {
  @ApiProperty({ description: 'Start date' })
  startDate: string;

  @ApiProperty({ description: 'End date' })
  endDate: string;

  @ApiProperty({ description: 'Total products' })
  totalProducts: number;

  @ApiProperty({ description: 'Products created in date range' })
  productsInRange: number;

  @ApiProperty({ description: 'Percentage in date range' })
  percentageInRange: number;
}

export class CustomReportDto {
  @ApiProperty({ description: 'Report title' })
  title: string;

  @ApiProperty({ description: 'Report description' })
  description: string;

  @ApiProperty({ description: 'Total products' })
  totalProducts: number;

  @ApiProperty({ description: 'Recent products (last 30 days)' })
  recentProducts: number;

  @ApiProperty({ description: 'Average products per day' })
  averageProductsPerDay: number;

  @ApiProperty({ description: 'Report generation timestamp' })
  generatedAt: string;
}
