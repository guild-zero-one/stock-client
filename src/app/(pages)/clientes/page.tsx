"use client";

import { useState, useMemo, useEffect } from "react";

import { listarClientes } from "@/api/spring/services/ClienteService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { Paginacao } from "@/models/Paginacao/Paginacao";

import Link from "next/link";

import Header from "@/components/header";
import Input from "@/components/input";
import Filter from "@/components/filter";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";
import CustomersList from "@/components/customers-list";

import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PersonRemoveOutlined from "@mui/icons-material/PersonRemoveOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";

export default function Cliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao<ClienteResponse> | null>(
    null
  );

  const [filter, setFilter] = useState<string>("Pedidos");
  const [searchTerm, setSearchTerm] = useState("");
  const [modoListagem, setModoListagem] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await listarClientes();
        setPaginacao(response);

        const clientesFiltrados = response.content
          .filter(cliente =>
            cliente.permissao && cliente.permissao.includes
              ? cliente.permissao.includes("COMUM")
              : false
          )
          .filter(cliente => {
            if (modoListagem === "ativos") {
              return cliente.ativo ?? true;
            } else if (modoListagem === "inativos") {
              return !cliente.ativo;
            } else {
              return true; // Mostra todos
            }
          });

        setClientes(clientesFiltrados);
      } catch (error) {
        console.error("Erro ao listar clientes:", error);
        setClientes([]);
        setPaginacao(null);
      }
    };
    fetchClientes();
  }, [modoListagem]);

  const clientesOrdenados = useMemo(() => {
    let todosClientes = [...clientes];

    if (searchTerm) {
      todosClientes = todosClientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getModoListagemInfo = () => {
    switch (modoListagem) {
      case "ativos":
        return { text: "Listar inativos", icon: <PersonRemoveOutlined /> };
      case "inativos":
        return { text: "Listar todos", icon: <PeopleOutlined /> };
      case "todos":
        return { text: "Listar ativos", icon: <PersonOutlined /> };
      default:
        return { text: "Listar inativos", icon: <PersonRemoveOutlined /> };
    }
  };

  const handleModoListagemChange = () => {
    if (modoListagem === "ativos") {
      setModoListagem("inativos");
    } else if (modoListagem === "inativos") {
      setModoListagem("todos");
    } else {
      setModoListagem("ativos");
    }
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      <Header backRouter="/" title="Todos" subtitle="Meus clientes">
        <DropdownAdd>
          <Link href={"clientes/adicionar"}>
            <DropdownItem text="Adicionar Cliente" icon={<AddCircle />} />
          </Link>
          <button
            className="w-full"
            onClick={handleModoListagemChange}
            title={getModoListagemInfo().text}
          >
            <DropdownItem
              text={getModoListagemInfo().text}
              icon={getModoListagemInfo().icon}
            />
          </button>
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
          handleChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtro */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Filter onChangeFilter={selected => setFilter(selected)} />
      </div>

      {/* Lista de clientes */}
      <div className="flex-1 overflow-y-auto">
        <CustomersList
          clientes={clientesOrdenados}
          uri={cliente => `/clientes/${cliente.id}`}
        />
      </div>
    </div>
  );
}
