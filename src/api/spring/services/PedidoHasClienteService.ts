import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";
import { PedidoItemHasProduto } from "@/models/PedidoItem/PedidoItemHasProduto";

import { buscarPedidoPorId } from "./PedidoVendaService";
import { listarProdutoComImagensPorId } from "./ProdutoHasImagensService";
import { marcaPorId } from "./FornecedorService";

import { ParamValue } from "next/dist/server/request/params";

export const buscarPedidoDetalhadoPorId = async (
  pedidoId: ParamValue
): Promise<PedidoHasProduto> => {
  const pedidoResponse = await buscarPedidoPorId(pedidoId);

  const itensDetalhados: PedidoItemHasProduto[] = await Promise.all(
    pedidoResponse.itens.map(async (item) => {
      const produto = await listarProdutoComImagensPorId(item.idProduto);
      const fornecedor = await marcaPorId(produto.fornecedorId);

      return {
        item,
        produto,
        fornecedor,
      };
    })
  );

  return {
    id: pedidoResponse.id,
    status: pedidoResponse.status,
    idUsuario: pedidoResponse.idUsuario,
    criadoEm: pedidoResponse.criadoEm,
    itens: itensDetalhados,
  };
};
