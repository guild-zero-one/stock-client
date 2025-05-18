"use client";

import { useState, useMemo, useEffect } from "react";

import { listarClientes } from "@/api/spring/services/ClienteService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Link from "next/link";

import Header from "@/components/header";
import Input from "@/components/input";
import Filter from "@/components/filter";
import CardCustomer from "@/components/card-customer";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";

export default function Cliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [filter, setFilter] = useState<string>("Pedidos");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response: ClienteResponse[] = await listarClientes();
        console.log("Clientes:", response);
        setClientes(response);
      } catch (error) {
        console.error("Erro ao listar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const clientesOrdenados = useMemo(() => {
    const todosClientes = [...clientes];

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
  }, [filter, clientes]);

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <Header title="Todos" subtitle="Meus clientes">
        <DropdownAdd>
          <Link href={"clientes/adicionar"}>
            <DropdownItem text="Adicionar Cliente" icon={<AddCircle />} />
          </Link>
        </DropdownAdd>
      </Header>

      {/* Pesquisar */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          type="text"
          showIcon
          iconSymbol={<SearchIcon />}
          inputSize="small"
        />
      </div>

      {/* Filtro */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Filter onChangeFilter={(selected) => setFilter(selected)} />
      </div>

      {/* Lista de clientes */}
      <div className="flex flex-col gap-4 p-4 w-full">
        {clientes.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum cliente encontrado.
          </p>
        ) : (
          clientesOrdenados.map((cliente) => (
            <Link key={cliente.id} href={`clientes/${cliente.id}`}>
              <CardCustomer
                nome={cliente.nome}
                sobrenome={cliente.sobrenome}
                contato={cliente.contato?.celular ?? "Não informado"}
                qtdPedidos={cliente.qtdPedidos}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
