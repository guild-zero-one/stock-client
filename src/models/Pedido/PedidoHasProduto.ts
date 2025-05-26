import { PedidoItemHasProduto } from "../PedidoItem/PedidoItemHasProduto";

import { ParamValue } from "next/dist/server/request/params";

export interface PedidoHasProduto {
  id: number;
  status: string;
  idUsuario: ParamValue;
  criadoEm: Date;
  itens: PedidoItemHasProduto[];
}
