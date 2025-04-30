import { Produto } from "./Produto";

export interface Fornecedor {
  id: number;
  nome: string;
  imagemUrl: string;
  descricao: string;
  produtos: Produto[];
}
