"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import { buscarClientePorId } from "@/api/spring/services/ClienteService";
import { buscarPedidoDetalhadoPorId } from "@/api/spring/services/PedidoHasClienteService";
import { alterarStatusPedido } from "@/api/spring/services/PedidoVendaService";

import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";
import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import FooterOrder from "@/components/footer";
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
    "successCancel" | "errorCancel" | "successFinalize" | "errorFinalize" | null
  >(null);
  const [desconto, setDesconto] = useState<number>(0);

  const handleDesconto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesconto(Number(e.target.value));
  };

  const showToast = (
    type: "successCancel" | "errorCancel" | "successFinalize" | "errorFinalize"
  ) => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const toastMap = {
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

  const finalizarPedido = async () => {
    if (!pedido) return;

    setModalTipo("finalizar");

    try {
      await alterarStatusPedido(pedidoId, "CONCLUIDO");
      showToast("successFinalize");
    } catch (error) {
      showToast("errorFinalize");
    }
  };

  const cancelarPedido = async () => {
    if (!pedido) return;

    setModalTipo("cancelar");
    setModalAberto(true);

    try {
      await alterarStatusPedido(pedidoId, "CANCELADO");
      showToast("successCancel");
    } catch (error) {
      showToast("errorCancel");
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
              onSubmit={finalizarPedido}
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
                  onClick={() => setModalAberto(false)}
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

      <FooterOrder
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
