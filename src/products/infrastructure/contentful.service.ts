import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContentfulResponse, ContentfulProduct } from './contentful.interface';
import { Product } from '../domain/product.interface';

@Injectable()
export class ContentfulService {
  private readonly logger = new Logger(ContentfulService.name);
  private readonly spaceId: string;
  private readonly accessToken: string;
  private readonly environment: string;
  private readonly contentType: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    this.accessToken = this.configService.get<string>(
      'CONTENTFUL_ACCESS_TOKEN',
    );
    this.environment = this.configService.get<string>(
      'CONTENTFUL_ENVIRONMENT',
      'master',
    );
    this.contentType = this.configService.get<string>(
      'CONTENTFUL_CONTENT_TYPE',
      'product',
    );
    this.baseUrl = this.configService.get<string>('CONTENTFUL_API_URL');
  }

  async fetchProducts(): Promise<
    Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]
  > {
    try {
      this.logger.log('Fetching products from Contentful...');
      const url = `${this.baseUrl}/spaces/${this.spaceId}/environments/${this.environment}/entries?access_token=${this.accessToken}&content_type=${this.contentType}`;
      console.log(url);

      const response = await axios.get<ContentfulResponse>(url, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(
        `Fetched ${response.data.items.length} products from Contentful`,
      );

      return response.data.items.map(this.mapContentfulProduct);
    } catch (error) {
      this.logger.error(
        'Error fetching products from Contentful:',
        error.message,
      );
      throw new Error(
        `Failed to fetch products from Contentful: ${error.message}`,
      );
    }
  }

  private mapContentfulProduct(
    contentfulProduct: ContentfulProduct,
  ): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
    const imageUrl = contentfulProduct.fields.image?.fields?.file?.url;

    return {
      contentfulId: contentfulProduct.sys.id,
      name: contentfulProduct.fields.name || 'Unnamed Product',
      description: contentfulProduct.fields.description,
      price: contentfulProduct.fields.price,
      category: contentfulProduct.fields.category,
      imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
      isDeleted: false,
    };
  }
}
