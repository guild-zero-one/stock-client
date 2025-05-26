"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { buscarPedidoPorId } from "@/api/spring/services/PedidoVendaService";
import { listarProdutoComImagensPorId } from "@/api/spring/services/ProdutoHasImagensService";
import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";

import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";
import { PedidoItemHasProduto } from "@/models/PedidoItem/PedidoItemHasProduto";
import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import FooterOrder from "@/components/footer-order";
import DetailOrder from "@/components/detail-order";
import OrdersList from "@/components/orders-list";

export default function DetalhePedido() {
  const [pedido, setPedido] = useState<PedidoHasProduto | null>();
  const [cliente, setCliente] = useState<ClienteResponse | null>();

  const { pedidoId } = useParams();

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const pedidoResponse = await buscarPedidoPorId(pedidoId);

        const itensDetalhados = await Promise.all(
          pedidoResponse.itens.map(async (item) => {
            const produto = await listarProdutoComImagensPorId(item.idProduto);
            const fornecedor = await marcaPorId(produto.fornecedorId);

            return {
              item,
              produto,
              fornecedor,
            } as PedidoItemHasProduto;
          })
        );

        const pedidoDetalhado: PedidoHasProduto = {
          id: pedidoResponse.id,
          status: pedidoResponse.status,
          idUsuario: pedidoResponse.idUsuario,
          criadoEm: pedidoResponse.criadoEm,
          itens: itensDetalhados,
        };

        setPedido(pedidoDetalhado);

        const clienteResponse = await buscarClientePorId(
          pedidoResponse.idUsuario
        );

        setCliente(clienteResponse);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  const atualizarQuantidade = (produtoId: number, novaQtd: number) => {
    if (!pedido) return;

    const novosItens = pedido.itens.map((item) =>
      item.produto.id === produtoId
        ? {
            ...item,
            item: {
              ...item.item,
              quantidade: novaQtd,
            },
          }
        : item
    );

    setPedido({ ...pedido, itens: novosItens });
  };

  const deletarItem = (produtoId: number) => {
    if (!pedido) return;

    const novosItens = pedido.itens.filter(
      (item) => item.produto.id !== produtoId
    );

    setPedido({ ...pedido, itens: novosItens });
  };

  const total = pedido?.itens.reduce(
    (soma, p) => soma + p.item.quantidade * p.item.precoUnitario,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-white-default relative">
      <Header title="Detalhes" subtitle="Pedido" />

      <DetailOrder
        nomeCliente={cliente?.nome || "Carregando..."}
        quantidadeProdutos={pedido?.itens.reduce(
          (s, p) => s + p.item.quantidade,
          0
        )}
        criadoEm={pedido?.criadoEm && ""}
      />

      {pedido && (
        <OrdersList
          pedido={pedido}
          atualizar={atualizarQuantidade}
          deletar={deletarItem}
        />
      )}

      <FooterOrder total={total ?? 0} onConfirm={() => alert("Confirmado!")} />
    </div>
  );
}
