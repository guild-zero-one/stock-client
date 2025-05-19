"use client";

import Link from "next/link";

import Header from "@/components/header";
import Input from "@/components/input";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import CardOrder from "@/components/card-order";

export default function Pedido() {
  const pedidos = [
    {
      id: 1,
      nome: "Maria",
      sobrenome: "Eduarada",
      valorPedido: 100,
      dataCriacao: "12-12-2020",
    },
    {
      id: 2,
      nome: "João",
      sobrenome: "Silva",
      valorPedido: 200,
      dataCriacao: "13-12-2020",
    },
    {
      id: 3,
      nome: "Ana",
      sobrenome: "Santos",
      valorPedido: 150,
      dataCriacao: "14-12-2020",
    },
    {
      id: 4,
      nome: "Carlos",
      sobrenome: "Oliveira",
      valorPedido: 250,
      dataCriacao: "15-12-2020",
    },
    {
      id: 5,
      nome: "Fernanda",
      sobrenome: "Pereira",
      valorPedido: 300,
      dataCriacao: "16-12-2020",
    },
  ];

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <Header title="Todos" subtitle="Pedidos">
        <DropdownAdd>
          <Link href={"pedidos/adicionar"}>
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
          showIcon
          iconSymbol={<SearchIcon />}
          inputSize="small"
        />
      </div>

      {/* Lista de pedidos */}
      <div className="flex flex-col gap-4 p-4 w-full">
        {pedidos.map((pedido, index) => (
          <CardOrder
            key={pedido.id}
            numero={index + 1}
            nome={pedido.nome}
            sobrenome={pedido.sobrenome}
            valorPedido={pedido.valorPedido}
            dataCriacao={pedido.dataCriacao}
          />
        ))}
      </div>
    </div>
  );
}
