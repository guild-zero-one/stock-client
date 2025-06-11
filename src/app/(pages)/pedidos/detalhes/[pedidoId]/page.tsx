"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { buscarClientePorId } from "@/api/spring/services/ClienteService";
import { buscarPedidoDetalhadoPorId } from "@/api/spring/services/PedidoHasClienteService";
import {
  alterarStatusPedido,
  editarPedido,
} from "@/api/spring/services/PedidoVendaService";
import { cadastrarVenda } from "@/api/spring/services/VendaService";
import {
  atualizarProduto,
  produtoPorId,
} from "@/api/spring/services/ProdutoService";

import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";
import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import Footer from "@/components/footer";
import DetailOrder from "@/components/detail-order";
import OrdersList from "@/components/orders-list";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";
import Modal from "@/components/modal-popup";
import Button from "@/components/button";
import Input from "@/components/input";
import Toast from "@/components/toast";

import {
  AddCircle,
  AssignmentLateOutlined,
  AssignmentTurnedInOutlined,
  SellOutlined,
} from "@mui/icons-material";

export default function DetalhePedido() {
  const [pedido, setPedido] = useState<PedidoHasProduto | null>(null);
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"cancelar" | "finalizar" | null>(
    null
  );
  const [toast, setToast] = useState<
    | "successCancel"
    | "errorCancel"
    | "successFinalize"
    | "errorFinalize"
    | "successSave"
    | "errorSave"
    | "quantityError"
    | null
  >(null);
  const [customQuantityMessage, setCustomQuantityMessage] = useState<
    string | null
  >(null);
  const [desconto, setDesconto] = useState<number>(0);

  const handleDesconto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesconto(Number(e.target.value));
  };

  const showToast = (
    type:
      | "successCancel"
      | "errorCancel"
      | "successFinalize"
      | "errorFinalize"
      | "successSave"
      | "errorSave"
      | "quantityError"
      | null
  ) => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const toastMap = {
    successSave: {
      title: "Pedido atualizado com sucesso",
      message: "Você será redirecionado para os detalhes do pedido.",
      type: "success",
    },
    errorSave: {
      title: "Erro ao atualizar pedido",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
    successCancel: {
      title: "Pedido cancelado com sucesso",
      message: "Você será redirecionado para os detalhes do pedido.",
      type: "success",
    },
    errorCancel: {
      title: "Erro ao cancelar pedido",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
    successFinalize: {
      title: "Pedido finalizado com sucesso",
      message: "Você será redirecionado para os detalhes do pedido.",
      type: "success",
    },
    errorFinalize: {
      title: "Erro ao finalizar pedido",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
    quantityError: {
      title: "Erro de quantidade",
      message:
        customQuantityMessage ||
        "Quantidade insuficiente em estoque para finalizar o pedido. ",
      type: "error",
    },
  } as const;

  const { pedidoId } = useParams();

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const pedidoDetalhado = await buscarPedidoDetalhadoPorId(pedidoId);
        setPedido(pedidoDetalhado);

        const cliente = await buscarClientePorId(pedidoDetalhado.idUsuario);
        setCliente(cliente);
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  const atualizarQuantidade = (produtoId: number, novaQtd: number) => {
    if (!pedido) return;

    const novosItens = pedido.itens.map((item) =>
      item.produto.id === produtoId
        ? {
            ...item,
            item: {
              ...item.item,
              quantidade: novaQtd,
            },
          }
        : item
    );

    setPedido({ ...pedido, itens: novosItens });
  };

  const deletarItem = (produtoId: number) => {
    if (!pedido) return;

    const novosItens = pedido.itens.filter(
      (item) => item.produto.id !== produtoId
    );

    setPedido({ ...pedido, itens: novosItens });
  };

  const total = pedido?.itens.reduce(
    (soma, p) => soma + p.item.quantidade * p.item.precoUnitario,
    0
  );

  const router = useRouter();

  const finalizarPedido = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checarEstoque = async () => {
      const produtos = await Promise.all(
        (pedido?.itens || []).map((item) => produtoPorId(item.produto.id))
      );

      for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];
        const item = pedido?.itens[i];
        if (produto && item) {
          if (produto.quantidade < item.item.quantidade) {
            setCustomQuantityMessage(
              `Estoque insuficiente para o produto: ${produto.nome}.`
            );
            throw new Error(
              "Quantidade insuficiente em estoque do produto: " + produto.nome
            );
          }
        }
      }
    };

    const hoje = new Date();

    const dataVenda = hoje.toISOString().slice(0, 10);

    const venda = {
      desconto: desconto,
      pagamentoRealizado: true,
      pedidos: [Number(pedidoId)],
      dataVenda: dataVenda,
    };

    try {
      setModalAberto(false);

      await checarEstoque();

      await Promise.all(
        (pedido?.itens || []).map(async (item) => {
          const produto = await produtoPorId(item.produto.id);
          if (produto) {
            const quantidadeAtualizada =
              produto.quantidade - item.item.quantidade;
            produto.quantidade = quantidadeAtualizada;
            await atualizarProduto(produto.id, produto);
          }
        })
      );

      await editarPedido(pedidoId, {
        idUsuario: Number(pedido?.idUsuario),
        itens: pedido?.itens
          ? pedido.itens.map((item) => ({
              idProduto: item.produto.id,
              quantidade: item.item.quantidade,
              precoUnitario: item.item.precoUnitario,
            }))
          : [],
      });
      await alterarStatusPedido(pedidoId, "CONCLUIDO");
      await cadastrarVenda(venda);

      showToast("successFinalize");

      setTimeout(() => {
        router.push(`/pedidos`);
      }, 3000);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Quantidade insuficiente")
      ) {
        showToast("quantityError");
      } else {
        showToast("errorFinalize");
      }
    }
  };

  const cancelarPedido = async () => {
    try {
      setModalAberto(false);

      await alterarStatusPedido(pedidoId, "CANCELADO");

      showToast("successCancel");

      setTimeout(() => {
        router.push(`/pedidos`);
      }, 3000);
    } catch (error) {
      showToast("errorCancel");
    }
  };

  const pendentePedido = async () => {
    try {
      setModalAberto(false);

      const pedidoAtualizado = {
        idUsuario: Number(pedido?.idUsuario),
        itens: pedido?.itens
          ? pedido.itens.map((item) => ({
              idProduto: item.produto.id,
              quantidade: item.item.quantidade,
              precoUnitario: item.item.precoUnitario,
            }))
          : [],
      };

      await editarPedido(pedidoId, pedidoAtualizado);

      showToast("successSave");

      setTimeout(() => {
        router.push(`/pedidos`);
      }, 3000);
    } catch (error) {
      showToast("errorSave");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white-default relative">
      {toast && <Toast {...toastMap[toast]} />}

      <Header title="Detalhes" subtitle="Pedido" backRouter="/pedidos">
        <DropdownAdd>
          <Link
            href={`/pedidos/clientes/${cliente?.id}/editar/pedidos/${pedidoId}`}
          >
            <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
          </Link>
        </DropdownAdd>
      </Header>

      <DetailOrder
        nomeCliente={cliente?.nome || "Carregando..."}
        quantidadeProdutos={pedido?.itens.reduce(
          (s, p) => s + p.item.quantidade,
          0
        )}
        criadoEm={pedido?.criadoEm && ""}
      />

      {pedido && (
        <OrdersList
          pedido={pedido}
          atualizar={atualizarQuantidade}
          deletar={deletarItem}
        />
      )}

      <Modal
        open={modalAberto}
        icon={
          modalTipo === "cancelar" ? (
            <AssignmentLateOutlined fontSize="inherit" />
          ) : (
            <AssignmentTurnedInOutlined fontSize="inherit" />
          )
        }
        onClose={() => {
          setModalAberto(false);
        }}
        title={
          modalTipo === "cancelar" ? (
            <p>Cancelar Pedido</p>
          ) : (
            <p>Finalizar Pedido</p>
          )
        }
        body={
          modalTipo === "cancelar" ? (
            <div className="flex justify-center flex-col gap-4">
              <span className="flex flex-col gap-1">
                <p className="w-full text-center">
                  Deseja cancelar este pedido?
                </p>
                <p className="text-pink-default font-bold">
                  Essa ação é irreversível e não poderá ser desfeita.
                </p>
              </span>

              <span className="flex flex-col gap-2">
                <Button
                  onClick={() => setModalAberto(false)}
                  fullWidth
                  label="Não, não desejo cancelar"
                  variant="outlined"
                ></Button>
                <Button
                  onClick={cancelarPedido}
                  fullWidth
                  label="Sim, desejo cancelar"
                ></Button>
              </span>
            </div>
          ) : (
            <form
              onSubmit={(e) => finalizarPedido(e)}
              className="flex justify-center flex-col gap-2"
            >
              <p className="w-full text-center">Deseja finalizar o pedido?</p>

              <Input
                iconSymbol={<SellOutlined />}
                handleChange={(e) => {
                  handleDesconto(e);
                }}
                label="Aplicar desconto"
                name="desconto"
                size="small"
              />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={pendentePedido}
                  fullWidth
                  label="Pendente"
                  variant="outlined"
                ></Button>
                <Button type="submit" fullWidth label="Finalizado"></Button>
              </div>
            </form>
          )
        }
      />

      <Footer
        total={total ?? 0}
        onCancel={() => {
          setModalTipo("cancelar");
          setModalAberto(true);
        }}
        onConfirm={() => {
          setModalTipo("finalizar");
          setModalAberto(true);
        }}
      />
    </div>
  );
}
