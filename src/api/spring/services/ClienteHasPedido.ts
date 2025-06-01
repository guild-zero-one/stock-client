import { ClienteHasPedido } from "@/models/Cliente/ClienteHasPedido";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { PedidoResponse } from "@/models/Pedido/PedidoResponse";

import { buscarClientePorId } from "./ClienteService";
import { listarPedidosDoCliente } from "./PedidoVendaService";

import { ParamValue } from "next/dist/server/request/params";

export const listarClientesComPedidoPorId = async (
  idCliente: ParamValue
): Promise<ClienteHasPedido> => {
  const cliente: ClienteResponse = await buscarClientePorId(idCliente);
  const pedidos: PedidoResponse[] = await listarPedidosDoCliente(idCliente);

  return {
    ...cliente,
    pedidos,
  };
};
