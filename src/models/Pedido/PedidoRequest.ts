import { PedidoItemRequest } from "../PedidoItem/PedidoItemRequest";

export interface PedidoRequest {
  idUsuario: number;
  itens: PedidoItemRequest[];
}
