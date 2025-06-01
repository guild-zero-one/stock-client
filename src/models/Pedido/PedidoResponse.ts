import { PedidoItemResponse } from "../PedidoItem/PedidoItemResponse";

import { ParamValue } from "next/dist/server/request/params";

export interface PedidoResponse {
  id: number;
  status: string;
  idUsuario: ParamValue;
  itens: PedidoItemResponse[];
  criadoEm: Date;
}
