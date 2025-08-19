import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from '../application/reports.service';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import {
  DateRangeQueryDto,
  DeletedProductsReportDto,
  PriceAnalysisReportDto,
  DateRangeReportDto,
  CustomReportDto,
} from './reports.dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-products')
  @ApiOperation({ summary: 'Get deleted products percentage report' })
  @ApiResponse({
    status: 200,
    description: 'Deleted products report',
    type: DeletedProductsReportDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDeletedProductsReport(): Promise<DeletedProductsReportDto> {
    return this.reportsService.getDeletedProductsReport();
  }

  @Get('price-analysis')
  @ApiOperation({ summary: 'Get price analysis report for non-deleted products' })
  @ApiResponse({
    status: 200,
    description: 'Price analysis report',
    type: PriceAnalysisReportDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPriceAnalysisReport(): Promise<PriceAnalysisReportDto> {
    return this.reportsService.getPriceAnalysisReport();
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get products report for custom date range' })
  @ApiResponse({
    status: 200,
    description: 'Date range report',
    type: DateRangeReportDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDateRangeReport(@Query() query: DateRangeQueryDto): Promise<DateRangeReportDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    return this.reportsService.getDateRangeReport(startDate, endDate);
  }

  @Get('custom')
  @ApiOperation({ summary: 'Get custom product activity report' })
  @ApiResponse({
    status: 200,
    description: 'Custom report',
    type: CustomReportDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCustomReport(): Promise<CustomReportDto> {
    return this.reportsService.getCustomReport();
  }
}
