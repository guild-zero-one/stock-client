import { PedidoItemRequest } from "../PedidoItem/PedidoItemRequest";

export interface PedidoRequest {
  idUsuario: string;
  itens: PedidoItemRequest[];
}
