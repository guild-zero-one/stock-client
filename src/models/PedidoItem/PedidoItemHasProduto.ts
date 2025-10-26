import { Marca } from "../Marca/Marca";
import { Produto } from "../Produto/Produto";
import { PedidoItemResponse } from "./PedidoItemResponse";

export interface PedidoItemHasProduto {
  item: PedidoItemResponse;
  produto: Produto;
  fornecedor: Marca;
}
