import { Produto } from "./Produto";

export interface Categoria {
    id: number;
    name: string;
    image: string;
    description: string;
    quantity: number;
    products: Produto[];
  };
  