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
  const [status, setStatus] = useState<string[]>(["PENDENTE"]);
  const [search, setSearch] = useState<string>("");

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

  const pedidosFiltrados = pedidos.filter(
    (pedido) =>
      status.includes(pedido.status) &&
      (!search ||
        pedido.cliente?.nome?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      <Header title="Todos" subtitle="Pedidos" backRouter="/">
        <DropdownAdd>
          <Link href={"pedidos/clientes"}>
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
          value={search}
          handleChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de pedidos */}
      <div className="flex flex-col gap-2 p-4 w-full">
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum pedido encontrado :(
          </div>
        ) : (
          pedidosFiltrados.map((pedido, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}
