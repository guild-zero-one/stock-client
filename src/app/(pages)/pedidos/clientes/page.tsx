"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

import { listarClientes } from "@/api/spring/services/ClienteService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { Paginacao } from "@/models/Paginacao/Paginacao";

import Header from "@/components/header";
import Input from "@/components/input";
import Filter from "@/components/filter";
import CustomersList from "@/components/customers-list";

import SearchIcon from "@mui/icons-material/Search";

export default function EscolherCliente() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao<ClienteResponse> | null>(
    null
  );
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const [filter, setFilter] = useState<string>("Pedidos");
  const [searchTerm, setSearchTerm] = useState("");

  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const carregarClientes = async (
    pagina: number = 0,
    adicionar: boolean = false
  ) => {
    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const response = await listarClientes(pagina, 4);
      
      const clientesFiltrados = response.content
        .filter(cliente =>
          cliente.permissao && cliente.permissao.includes
            ? cliente.permissao.includes("COMUM")
            : false
        )
        .filter(cliente => cliente.ativo ?? true);

      setPaginacao({
        ...response,
        content: clientesFiltrados
      });

      if (adicionar) {
        setClientes(prev => [...prev, ...clientesFiltrados]);
      } else {
        setClientes(clientesFiltrados);
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

  // Remove duplicatas com base no ID antes de renderizar
  const clientesUnicos = Array.from(
    new Map(clientes.map(cliente => [cliente.id, cliente])).values()
  );

  const clientesFiltrados = useMemo(() => {
    let todosClientes = [...clientes];

    if (searchTerm) {
      todosClientes = todosClientes.filter(cliente =>
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

  // Aplica filtros de ordenação nos clientes únicos (quando não há pesquisa)
  const clientesUnicosOrdenados = useMemo(() => {
    let todosClientes = [...clientesUnicos];

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
  }, [filter, clientesUnicos]);

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
          handleChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtro */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Filter onChangeFilter={selected => setFilter(selected)} />
      </div>

      {/* Lista de clientes */}
      <div className="flex-1 overflow-y-auto">
        {searchTerm.length === 0 ? (
          clientes.length > 0 ? (
            <>
              {clientesUnicosOrdenados.map((cliente, index) => (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CustomersList
                    clientes={[cliente]}
                    uri={cliente => `/pedidos/clientes/${cliente.id}`}
                  />
                </motion.div>
              ))}
              <div ref={sentinelaRef} className="h-5" />
              {carregandoMais && (
                <div className="flex flex-col gap-3 px-4">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                    >
                      <div className="w-12 h-12 bg-gray-300 rounded-full" />
                      <div className="flex flex-col flex-1">
                        <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
                        <div className="w-2/3 h-3 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
              <h2>Nenhum cliente encontrado.</h2>
            </div>
          )
        ) : clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CustomersList
                clientes={[cliente]}
                uri={cliente => `/pedidos/clientes/${cliente.id}`}
              />
            </motion.div>
          ))
        ) : (
          <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
            <h2>Nenhum cliente encontrado.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
