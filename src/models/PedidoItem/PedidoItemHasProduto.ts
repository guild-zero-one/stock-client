import { Fornecedor } from "../Fornecedor/Fornecedor";
import { ProdutoHasImagens } from "../Produto/ProdutoHasImagens";
import { PedidoItemResponse } from "./PedidoItemResponse";

export interface PedidoItemHasProduto {
  item: PedidoItemResponse;
  produto: ProdutoHasImagens;
  fornecedor: Fornecedor;
}
