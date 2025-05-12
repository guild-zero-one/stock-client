"use client";

import { useState, useMemo } from "react";

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
  const [filter, setFilter] = useState<string>("Pedidos");

  const clientes = [
    {
      id: 1,
      nome: "A Cliente 2",
      contato: "987654321",
      qtdPedidos: 34,
      dataCriacao: "2023-10-01",
    },
    {
      id: 2,
      nome: "B Cliente 1",
      contato: "123456789",
      qtdPedidos: 12,
      dataCriacao: "2023-10-02",
    },
    {
      id: 3,
      nome: "C Cliente 3",
      contato: "456789123",
      qtdPedidos: 56,
      dataCriacao: "2023-10-03",
    },
    {
      id: 4,
      nome: "D Cliente 4",
      contato: "789123456",
      qtdPedidos: 23,
      dataCriacao: "2023-10-04",
    },
    {
      id: 5,
      nome: "E Cliente 5",
      contato: "321654987",
      qtdPedidos: 45,
      dataCriacao: "2023-10-05",
    },
  ];

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
          new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      );
    }

    return todosClientes;
  }, [filter]);

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
        {clientesOrdenados.map((cliente) => (
          <Link key={cliente.id} href={`clientes/${cliente.id}`}>
            <CardCustomer
              key={cliente.id}
              nome={cliente.nome}
              contato={cliente.contato}
              qtdPedidos={cliente.qtdPedidos}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
