"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { listarPedidos } from "@/api/spring/services/PedidoVendaService";
import { PedidoHasCliente } from "@/models/Pedido/PedidoHasCliente";
import { PedidoItemResponse } from "@/models/PedidoItem/PedidoItemResponse";
import { Paginacao } from "@/models/Paginacao/Paginacao";

import Header from "@/components/header";
import Input from "@/components/input";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import CardOrder from "@/components/card-order";

export default function Pedido() {
  const [pedidos, setPedidos] = useState<PedidoHasCliente[]>([]);
  const [paginacao, setPaginacao] =
    useState<Paginacao<PedidoHasCliente> | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string[]>(["PENDENTE"]);

  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const carregarPedidos = async (
    pagina: number = 0,
    adicionar: boolean = false
  ) => {
    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const response = await listarPedidos(pagina, 10, search);

      setPaginacao(response);

      if (adicionar) {
        setPedidos(prev => [...prev, ...response.content]);
      } else {
        setPedidos(response.content);
      }

      setPaginaAtual(pagina);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      if (!adicionar) {
        setPedidos([]);
        setPaginacao(null);
      }
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const carregarMaisPedidos = useCallback(() => {
    if (!paginacao || paginacao.last || carregandoMais) {
      return;
    }
    carregarPedidos(paginaAtual + 1, true);
  }, [paginacao, carregandoMais, paginaAtual]);

  useEffect(() => {
    carregarPedidos(0);
  }, [search]);

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
          carregarMaisPedidos();
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
  }, [paginacao?.last, carregarMaisPedidos]);

  function calcularValorPedido(itens: PedidoItemResponse[]): number {
    return itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );
  }

  const pedidosFiltrados = pedidos.filter(p => status.includes(p.status));

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

      {/* Lista */}
      <div className="flex flex-col gap-2 p-4 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
        {pedidosFiltrados.length === 0 && !carregando ? (
          <div className="text-center text-gray-500">
            Nenhum pedido encontrado :(
          </div>
        ) : (
          pedidosFiltrados.map((pedido, index) => (
            <motion.div
              key={pedido.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/pedidos/detalhes/${pedido.id}`}>
                <CardOrder
                  key={pedido.id}
                  index={index + 1}
                  nome={pedido.cliente?.nome || ""}
                  sobrenome={pedido.cliente?.sobrenome || ""}
                  valorPedido={calcularValorPedido(pedido.itens)}
                  criadoEm={pedido.criadoEm}
                />
              </Link>
            </motion.div>
          ))
        )}

        <div ref={sentinelaRef} className="h-5" />

        {carregandoMais && (
          <div className="flex justify-center items-center py-4 text-gray-500">
            Carregando mais pedidos...
          </div>
        )}
      </div>
    </div>
  );
}
