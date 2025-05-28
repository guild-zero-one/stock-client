"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { listarPedidos } from "@/api/spring/services/PedidoVendaService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";

import { PedidoHasCliente } from "@/models/Pedido/PedidoHasCliente";
import { PedidoItemResponse } from "@/models/PedidoItem/PedidoItemResponse";

import Header from "@/components/header";
import Input from "@/components/input";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import CardOrder from "@/components/card-order";

export default function Pedido() {
  const [pedidos, setPedidos] = useState<PedidoHasCliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const pedidos = await listarPedidos();

        const pedidosComCliente = await Promise.all(
          pedidos.map(async (pedido) => {
            const cliente = await buscarClientePorId(pedido.idUsuario);
            return {
              ...pedido,
              cliente,
            };
          })
        );

        setPedidos(pedidosComCliente);
      } catch (error) {
        console.error("Erro ao listar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  function calcularValorPedido(itens: PedidoItemResponse[]): number {
    return itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      <Header title="Todos" subtitle="Pedidos">
        <DropdownAdd>
          <Link href={"pedidos/adicionar/clientes"}>
            <DropdownItem text="Adicionar Pedido" icon={<AddCircle />} />
          </Link>
        </DropdownAdd>
      </Header>

      {/* Pesquisar */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          type="text"
          iconSymbol={<SearchIcon />}
          size="small"
        />
      </div>

      {/* Lista de pedidos */}
      <div className="flex flex-col gap-2 p-4 w-full">
        {pedidos.map((pedido, index) => (
          <Link key={pedido.id} href={`/pedidos/detalhes/${pedido.id}`}>
            <CardOrder
              key={pedido.id}
              index={index + 1}
              nome={pedido.cliente.nome}
              sobrenome={pedido.cliente.sobrenome}
              valorPedido={calcularValorPedido(pedido.itens)}
              criadoEm={pedido.criadoEm}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
