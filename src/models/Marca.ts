import { Produto } from "./Produto";

export interface Marca {
    id: number;
    name: string;
    image: string;
    description: string;
    quantity: number;
    products: Produto[];
  };
  