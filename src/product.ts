export interface IProduct {
  id: string;
  name: string;
  type: string;
  price?: number;
}

export class Product implements IProduct {
  id: string;
  name: string;
  type: string;
  price?: number;

  constructor({ id, name, type, price }: IProduct) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.price = price;
  }
}
