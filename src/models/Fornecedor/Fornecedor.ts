import { Produto } from "../Produto/Produto";

export interface Fornecedor {
  id: number;
  nome: string;
  imagemUrl: string;
  descricao: string;
  produtos: Produto[];
  cnpj: string;
}

export interface FornecedorCreate {
  nome: string;
  descricao: string;
  cnpj: string;
}
