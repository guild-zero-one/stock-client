import { Produto } from "./Produto";

export interface Marca {
  id: number;
  nome: string;
  url_imagem: string;
  descricao: string;
  produtos: Produto[];
}
