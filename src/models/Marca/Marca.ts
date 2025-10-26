import { Produto } from "../Produto/Produto";

export interface Marca {
  id: string;
  nome: string;
  imagemUrl: string;
  descricao: string;
  produtos: Produto[];
}

export interface MarcaCreate {
  nome: string;
  descricao: string;
  imagemUrl?: string;
}
