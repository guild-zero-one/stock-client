"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";
import { buscarClientePorId } from "@/api/spring/services/ClienteService";
import {
  buscarPedidoPorId,
  editarPedido,
} from "@/api/spring/services/PedidoVendaService";

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

export default function EditarEscolherProduto() {
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
      title: "Produto adicionado com sucesso",
      message: "Você será redirecionado para os detalhes do pedido.",
      type: "success",
    },
    error: {
      title: "Erro ao criar pedido",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const { marcaId, clienteId, pedidoId } = useParams();

  useEffect(() => {
    const fetchFornecedor = async () => {
      const fornecedor = await marcaPorId(Number(marcaId));
      if (fornecedor) {
        const produtos = await produtoPorMarca(Number(marcaId));
        setProdutos(produtos);
      }
    };

    fetchFornecedor();
  }, [marcaId]);

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

  const editar = async () => {
    if (!produtoSelecionado) return;

    try {
      setModalAberto(false);

      const pedido = await buscarPedidoPorId(pedidoId);

      const itensMap = new Map();
      pedido.itens.forEach((item) => {
        if (itensMap.has(item.idProduto)) {
          const existente = itensMap.get(item.idProduto);
          itensMap.set(item.idProduto, {
            ...existente,
            quantidade: existente.quantidade + item.quantidade,
          });
        } else {
          itensMap.set(item.idProduto, { ...item });
        }
      });

      const itens = Array.from(itensMap.values());

      const index = itens.findIndex(
        (item) => item.idProduto === produtoSelecionado.id
      );

      if (index >= 0) {
        itens[index].quantidade += 1;
      } else {
        itens.push({
          idProduto: produtoSelecionado.id,
          quantidade: 1,
          precoUnitario: produtoSelecionado.valorVenda,
        });
      }

      const pedidoAtualizado = {
        idUsuario: Number(clienteId),
        itens: itens,
      };

      const response = await editarPedido(pedidoId, pedidoAtualizado);

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
    return produtos.filter((produto) =>
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
          handleChange={(e) => setInputPesquisar(e.target.value)}
        />
      </div>

      {/* Lista de Produtos */}
      {produtosFiltrados.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsOrdersList
            produtos={produtosFiltrados}
            onClick={(produto) => {
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
              Deseja adicionar o produto
              <b className="text-pink-default"> {produtoSelecionado?.nome} </b>
              para o pedido do
              <b className="text-pink-default"> {cliente?.nome}</b>?
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
              <Button fullWidth label="Adicionar" onClick={editar}></Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
