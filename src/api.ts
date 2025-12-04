import axios from 'axios';
import { Product, IProduct } from './product';

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

    const { data } = await axios.get<IProduct[]>(url, {
      headers: {
        Authorization: this.generateAuthToken(),
      },
    });
    return data.map((p) => new Product(p));
  }

  async getProduct(id: string): Promise<Product> {
    const url = this.withPath(`/product/${id}`);
    const { data } = await axios.get<IProduct>(url, {
      headers: {
        Authorization: this.generateAuthToken(),
      },
    });
    return new Product(data);
  }
}

export default new API();
