"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";
import { criarPedido } from "@/api/spring/services/PedidoVendaService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { Produto } from "@/models/Produto/Produto";
import { Paginacao } from "@/models/Paginacao/Paginacao";

import Header from "@/components/header";
import Input from "@/components/input";
import ProductsOrdersList from "@/components/products-orders-list";
import Modal from "@/components/modal-popup";
import Button from "@/components/button";
import Toast from "@/components/toast";

import SearchIcon from "@mui/icons-material/Search";
import { AssignmentTurnedInOutlined } from "@mui/icons-material";

export default function EscolherProduto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao<Produto> | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [tamanhoPagina] = useState(4);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [inputPesquisar, setInputPesquisar] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState<null | "success" | "error">(null);

  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const showToast = (type: "success" | "error") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const toastMap = {
    success: {
      title: "Pedido adicionado com sucesso",
      message: "Você será redirecionado para os detalhes do pedido.",
      type: "success",
    },
    error: {
      title: "Erro ao criar pedido",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const { marcaId: idMarca, clienteId } = useParams();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputPesquisar(value);
  };

  const carregarProdutos = async (
    pagina: number = 0,
    adicionar: boolean = false
  ) => {
    if (!idMarca) return;

    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const dadosPaginados = await produtoPorMarca(
        idMarca as string,
        pagina,
        tamanhoPagina
      );
      setPaginacao(dadosPaginados);

      if (adicionar) {
        setProdutos(prev => [...prev, ...dadosPaginados.content]);
      } else {
        setProdutos(dadosPaginados.content);
      }

      setPaginaAtual(pagina);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      if (!adicionar) {
        setProdutos([]);
        setPaginacao(null);
      }
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const carregarMaisProdutos = useCallback(() => {
    if (!paginacao || paginacao.last || carregandoMais) {
      return;
    }
    carregarProdutos(paginaAtual + 1, true);
  }, [paginacao, carregandoMais, paginaAtual, idMarca, tamanhoPagina]);

  useEffect(() => {
    const fetchMarca = async () => {
      const marca = await marcaPorId(idMarca as string);
      if (marca) {
        carregarProdutos(0);
      }
    };
    fetchMarca();
  }, [idMarca]);

  useEffect(() => {
    const fetchCliente = async () => {
      const cliente = await buscarClientePorId(clienteId);
      if (cliente) {
        setCliente(cliente);
      }
    };
    fetchCliente();
  }, [clienteId]);

  useEffect(() => {
    if (!sentinelaRef.current) return;

    if (paginacao?.last || (paginacao?.content?.length === 0 && paginaAtual > 0)) {
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
          if (!carregandoMais && paginacao && !paginacao.last) {
            carregarProdutos(paginaAtual + 1, true);
          }
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
  }, [paginacao?.last, carregandoMais, paginaAtual, paginacao?.content?.length]);

  const router = useRouter();

  const adicionarPedido = async () => {
    if (!produtoSelecionado) return;

    const pedido = {
      idUsuario: clienteId as string,
      itens: [
        {
          idProduto: produtoSelecionado?.id,
          quantidade: 1,
          precoUnitario: produtoSelecionado?.valorVenda,
        },
      ],
    };

    try {
      setModalAberto(false);

      const response = await criarPedido(pedido);

      showToast("success");

      setTimeout(() => {
        router.push(`/pedidos/detalhes/${response.id}`);
      }, 3000);
    } catch (error) {
      showToast("error");
    }
  };

  const produtosFiltrados = (produtos || []).filter(produto =>
    produto.nome.toLowerCase().includes(inputPesquisar.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col w-full min-h-dvh bg-white-default">
      {toast && <Toast {...toastMap[toast]} />}

      <Header title="Escolher Produto" subtitle="Adicionar Pedido" />

      {/* Input de Pesquisa */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          iconSymbol={<SearchIcon />}
          handleChange={handleSearchChange}
        />
      </div>

      {/* Lista de Produtos */}
      {carregando ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-pink-secondary-dark">Carregando produtos...</div>
        </div>
      ) : inputPesquisar.length === 0 ? (
        <>
          <div className="gap-4 grid grid-cols-1 px-4">
            <ProductsOrdersList
              produtos={produtos}
              onClick={produto => {
                setProdutoSelecionado(produto);
                setModalAberto(true);
              }}
            />
          </div>
          {/* Sentinela para IntersectionObserver */}
          <div ref={sentinelaRef} className="h-5"/>
          {carregandoMais && (
            <div className="flex justify-center items-center py-4">
              <div className="text-pink-secondary-dark">
                Carregando mais produtos...
              </div>
            </div>
          )}
        </>
      ) : produtosFiltrados.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsOrdersList
            produtos={produtosFiltrados}
            onClick={produto => {
              setProdutoSelecionado(produto);
              setModalAberto(true);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
          <h2 className="italic">Nenhum produto encontrado</h2>
        </div>
      )}

      {/* Modal de Detalhe do Produto */}
      <Modal
        open={modalAberto}
        icon={<AssignmentTurnedInOutlined fontSize="inherit" />}
        onClose={() => {
          setModalAberto(false);
          setProdutoSelecionado(null);
        }}
        title={<>Adicionar Pedido</>}
        body={
          <div className="flex flex-col gap-4">
            <p>
              Deseja adicionar pedido para
              <b className="text-pink-default"> {cliente?.nome} </b>
              com o produto inicial sendo
              <b className="text-pink-default"> {produtoSelecionado?.nome}</b>?
            </p>

            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                label="Voltar"
                variant="outlined"
                onClick={() => {
                  setModalAberto(false);
                }}
              ></Button>
              <Button
                fullWidth
                label="Adicionar"
                onClick={adicionarPedido}
              ></Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
