import { ClienteResponse } from "../Cliente/ClienteResponse";
import { PedidoItemResponse } from "../PedidoItem/PedidoItemResponse";

import { ParamValue } from "next/dist/server/request/params";

export interface PedidoHasCliente {
  cliente: ClienteResponse;
  id: number;
  status: string;
  idUsuario: ParamValue;
  itens: PedidoItemResponse[];
  criadoEm: Date;
}
