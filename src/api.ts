import axios from 'axios';
import { Product, IProduct } from './product';

function isValidProduct(data: unknown): data is IProduct {
  if (!data || typeof data !== 'object') {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'string' &&
    (obj.price === undefined || typeof obj.price === 'number')
  );
}

function validateProduct(data: unknown): IProduct {
  if (!isValidProduct(data)) {
    throw new Error(
      `Invalid product data: ${JSON.stringify(data)}. Expected id, name, and type to be strings.`
    );
  }
  return data;
}

function validateProducts(data: unknown): IProduct[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of products');
  }
  return data.map(validateProduct);
}

export class API {
  url: string;

  constructor(url?: string) {
    if (!url) {
      url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
    } else if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    this.url = url;
  }

  withPath(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return `${this.url}${path}`;
  }

  generateAuthToken(): string {
    // Consider using a more secure token generation mechanism
    return 'Bearer ' + new Date().toISOString();
  }

  async getAllProducts(id?: string): Promise<Product[]> {
    const url = id
      ? this.withPath(`/products?id=${id}`)
      : this.withPath('/products');

    const { data } = await axios.get(url, {
      headers: {
        Authorization: this.generateAuthToken(),
      },
    });
    const validatedData = validateProducts(data);
    return validatedData.map((p) => new Product(p));
  }

  async getProduct(id: string): Promise<Product> {
    const url = this.withPath(`/product/${id}`);
    const { data } = await axios.get(url, {
      headers: {
        Authorization: this.generateAuthToken(),
      },
    });
    const validatedData = validateProduct(data);
    return new Product(validatedData);
  }
}

export default new API();
