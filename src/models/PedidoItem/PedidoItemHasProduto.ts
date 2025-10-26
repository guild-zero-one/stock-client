import { Fornecedor } from "../Marca/Marca";
import { ProdutoHasImagens } from "../Produto/ProdutoHasImagens";
import { PedidoItemResponse } from "./PedidoItemResponse";

export interface PedidoItemHasProduto {
  item: PedidoItemResponse;
  produto: ProdutoHasImagens;
  fornecedor: Fornecedor;
}
