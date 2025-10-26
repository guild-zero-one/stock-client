"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { listarPedidos } from "@/api/spring/services/PedidoVendaService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";

import { PedidoHasCliente } from "@/models/Pedido/PedidoHasCliente";
import { PedidoItemResponse } from "@/models/PedidoItem/PedidoItemResponse";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPedidos = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await listarPedidos(0, 200, search);

      const pedidosComCliente = await Promise.all(
        (response.content || []).map(async pedido => {
          try {
            const cliente = await buscarClientePorId(pedido.idUsuario);
            return {
              ...pedido,
              cliente,
            };
          } catch (error) {
            console.error(
              `Erro ao buscar cliente ${pedido.idUsuario} para pedido ${pedido.id}:`,
              error
            );
            // Retorna o pedido sem cliente para não quebrar a lista
            const clientePadrao: ClienteResponse = {
              id:
                typeof pedido.idUsuario === "string"
                  ? parseInt(pedido.idUsuario)
                  : 0,
              nome: "Cliente não encontrado",
              sobrenome: "",
              email: "",
              celular: "",
              ativo: true,
              permissao: "CLIENTE",
              qtdPedidos: 0,
              criadoEm: new Date(),
            };

            return {
              ...pedido,
              cliente: clientePadrao,
            };
          }
        })
      );

      setPedidos(pedidosComCliente);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPedidos();
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Reset quando status mudar
  useEffect(() => {
    fetchPedidos();
  }, [status]);

  function calcularValorPedido(itens: PedidoItemResponse[]): number {
    return itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );
  }

  // Filtro apenas por status (busca é feita no backend)
  const pedidosFiltrados = pedidos.filter(pedido =>
    status.includes(pedido.status)
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
          handleChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de pedidos */}
      <div className="flex flex-col gap-2 p-4 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
        {pedidosFiltrados.length === 0 && !loading ? (
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

        {/* Indicador de carregamento */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="text-gray-500">Carregando pedidos...</div>
          </div>
        )}
      </div>
    </div>
  );
}
