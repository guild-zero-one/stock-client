"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";
import { criarPedido } from "@/api/spring/services/PedidoVendaService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { Produto } from "@/models/Produto/Produto";

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
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [inputPesquisar, setInputPesquisar] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState<null | "success" | "error">(null);

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

  useEffect(() => {
    const fetchFornecedor = async () => {
      const fornecedor = await marcaPorId(idMarca as string);
      if (fornecedor) {
        const produtos = await produtoPorMarca(idMarca as string);
        setProdutos(produtos.content ?? []);
      }
    };

    fetchFornecedor();
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

  const produtosFiltrados = useMemo(() => {
    const termo = inputPesquisar.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo)
    );
  }, [produtos, inputPesquisar]);

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
          size="small"
          handleChange={e => setInputPesquisar(e.target.value)}
        />
      </div>

      {/* Lista de Produtos */}
      {produtosFiltrados.length > 0 ? (
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
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Nenhum produto encontrado :(</p>
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
