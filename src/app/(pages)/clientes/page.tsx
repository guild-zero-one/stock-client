"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

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
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const [filter, setFilter] = useState<string>("Pedidos");
  const [searchTerm, setSearchTerm] = useState("");
  const [modoListagem, setModoListagem] = useState<
    "ativos" | "inativos" | "todos"
  >("ativos");

  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const carregarClientes = async (pagina: number = 0, adicionar: boolean = false) => {
    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const response = await listarClientes(pagina, 4);
      setPaginacao(response);

      if (adicionar) {
        setClientes(prev => [...prev, ...response.content]);
      } else {
        setClientes(response.content);
      }

      setPaginaAtual(pagina);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      if (!adicionar) {
        setClientes([]);
        setPaginacao(null);
      }
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const carregarMaisClientes = useCallback(() => {
    if (!paginacao || paginacao.last || carregandoMais) {
      return;
    }
    carregarClientes(paginaAtual + 1, true);
  }, [paginacao, carregandoMais, paginaAtual]);

  useEffect(() => {
    carregarClientes(0);
  }, []);

  useEffect(() => {
    if (!sentinelaRef.current) return;

    if (paginacao?.last) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const node = sentinelaRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          carregarMaisClientes();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [paginacao?.last, carregarMaisClientes]);

  const clientesFiltrados = useMemo(() => {
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
        {clientesFiltrados.map((cliente, index) => (
          <motion.div
            key={cliente.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CustomersList
              clientes={[cliente]}
              uri={cliente => `/clientes/${cliente.id}`}
            />
          </motion.div>
        ))}
        <div ref={sentinelaRef} className="h-5" />
        {carregandoMais && (
          <div className="flex justify-center items-center py-4">
            <div className="text-pink-secondary-dark">Carregando mais clientes...</div>
          </div>
        )}
      </div>
    </div>
  );
}
