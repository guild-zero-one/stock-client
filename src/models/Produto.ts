import { ImagemProduto } from "./ImagemProduto";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  valor_venda: number;
  qtd: number;
  ImagemProduto: ImagemProduto[];
}
