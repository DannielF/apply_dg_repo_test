export interface ContentfulProduct {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

export interface ContentfulResponse {
  items: ContentfulProduct[];
  total: number;
}
