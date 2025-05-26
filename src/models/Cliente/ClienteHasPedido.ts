import { ClienteResponse } from "./ClienteResponse";

import { PedidoResponse } from "../Pedido/PedidoResponse";

export interface ClienteHasPedido extends ClienteResponse {
  pedidos: PedidoResponse[];
}
