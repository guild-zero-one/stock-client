"use client";

import { useState, useMemo, useEffect } from "react";

import { listarClientes } from "@/api/spring/services/ClienteService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import Input from "@/components/input";
import Filter from "@/components/filter";
import CustomersList from "@/components/customers-list";

import SearchIcon from "@mui/icons-material/Search";

export default function EscolherCliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [filter, setFilter] = useState<string>("Pedidos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response: ClienteResponse[] = await listarClientes();

        const clientesFiltrados = response.filter((cliente) =>
          cliente.permissao.includes("COMUM")
        );

        setClientes(clientesFiltrados);
      } catch (error) {
        console.error("Erro ao listar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const clientesOrdenados = useMemo(() => {
    let todosClientes = [...clientes];

    if (searchTerm) {
      todosClientes = todosClientes.filter((cliente) =>
        `${cliente.nome} ${cliente.sobrenome}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "Nome") {
      return todosClientes.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    if (filter === "Pedidos") {
      return todosClientes.sort((a, b) => b.qtdPedidos - a.qtdPedidos);
    }

    if (filter === "Recente") {
      return todosClientes.sort(
        (a, b) =>
          new Date(b.criadoEm ?? 0).getTime() -
          new Date(a.criadoEm ?? 0).getTime()
      );
    }

    return todosClientes;
  }, [filter, clientes, searchTerm]);

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      <Header title="Escolher Cliente" subtitle="Adicionar Pedido"></Header>

      {/* Pesquisar */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          type="text"
          iconSymbol={<SearchIcon />}
          size="small"
          handleChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtro */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Filter onChangeFilter={(selected) => setFilter(selected)} />
      </div>

      {/* Lista de clientes */}
      <CustomersList
        clientes={clientesOrdenados}
        uri={(cliente) => `/pedidos/clientes/${cliente.id}`}
      />
    </div>
  );
}
