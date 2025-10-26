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
import { finalizarPedido } from "@/api/spring/services/PedidoVendaService";

import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";
import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { VendaResponse } from "@/models/Venda/VendaResponse";
import { FinalizarPedidoRequest } from "@/models/Pedido/FinalizarPedidoRequest";
import { PedidoItemRequest } from "@/models/PedidoItem/PedidoItemRequest";

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
    | "alreadyFinalized"
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
      | "alreadyFinalized"
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
    alreadyFinalized: {
      title: "Pedido já finalizado",
      message: "Este pedido já foi finalizado e não pode ser alterado.",
      type: "error",
    },
  } as const;

  const { pedidoId } = useParams();

  const agruparItensDuplicados = (itens: any[]) => {
    const itensAgrupados: Record<string, any> = {};

    itens.forEach(item => {
      const produtoId = item.produto.id;

      if (itensAgrupados[produtoId]) {
        itensAgrupados[produtoId].item.quantidade += item.item.quantidade;
      } else {
        itensAgrupados[produtoId] = { ...item };
      }
    });

    return Object.values(itensAgrupados);
  };

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const pedidoDetalhado = await buscarPedidoDetalhadoPorId(pedidoId);
        console.log("Dados retornados do backend:", pedidoDetalhado);

        // Agrupar itens duplicados vindos do backend
        const pedidoComItensAgrupados = {
          ...pedidoDetalhado,
          itens: agruparItensDuplicados(pedidoDetalhado.itens),
        };

        console.log(
          "Dados após agrupamento no frontend:",
          pedidoComItensAgrupados
        );
        setPedido(pedidoComItensAgrupados);

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

    const novosItens = pedido.itens.map(item =>
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
      item => item.produto.id !== produtoId
    );

    setPedido({ ...pedido, itens: novosItens });
  };

  const total = pedido?.itens.reduce(
    (soma, p) => soma + p.item.quantidade * p.item.precoUnitario,
    0
  );

  const router = useRouter();

  // Função auxiliar para converter itens para o formato de requisição
  const converterItensParaRequisicao = (itens: any[]): PedidoItemRequest[] => {
    console.log("Itens antes da conversão:", itens);

    // Agrupar itens por produto
    const itensAgrupados: Record<string, PedidoItemRequest> = {};

    itens.forEach(item => {
      const produtoId = item.produto.id;
      const precoUnitario = item.item.precoUnitario;

      if (itensAgrupados[produtoId]) {
        // Se o produto já existe, somar a quantidade
        itensAgrupados[produtoId].quantidade += item.item.quantidade;
      } else {
        // Se é um novo produto, adicionar ao acumulador
        itensAgrupados[produtoId] = {
          idProduto: produtoId,
          quantidade: item.item.quantidade,
          precoUnitario: precoUnitario,
        };
      }
    });

    // Converter o objeto agrupado para array
    const itensConvertidos = Object.values(itensAgrupados);

    console.log("Itens após conversão e agrupamento:", itensConvertidos);
    return itensConvertidos;
  };

  const finalizarPedidoHandler = async (
    pedidoId: string | string[],
    finalizarPedidoRequest: FinalizarPedidoRequest
  ) => {
    try {
      console.log("Iniciando finalização do pedido:", pedidoId);
      console.log("Dados do pedido para finalização:", finalizarPedidoRequest);

      // Verificar se o pedido já está finalizado
      if (pedido?.status === "CONCLUIDO" || pedido?.status === "FINALIZADO") {
        console.log("Pedido já está finalizado, status:", pedido.status);
        showToast("alreadyFinalized");
        setModalAberto(false);
        return;
      }

      // Fechar o modal primeiro
      setModalAberto(false);

      const pedidoAtualizado = {
        idUsuario: pedido?.idUsuario as string,
        itens: pedido?.itens ? converterItensParaRequisicao(pedido.itens) : [],
      };

      console.log("Atualizando pedido com dados:", pedidoAtualizado);
      await editarPedido(pedidoId, pedidoAtualizado);

      console.log("Chamando finalizarPedido com:", {
        pedidoId,
        finalizarPedidoRequest,
      });
      const response = await finalizarPedido(pedidoId, finalizarPedidoRequest);

      console.log("Resposta da finalização:", response);

      if (response) {
        showToast("successFinalize");
        setTimeout(() => {
          router.push("/pedidos");
        }, 2000);
      } else {
        console.error("Resposta vazia da finalização");
        showToast("errorFinalize");
      }
    } catch (error: any) {
      console.error("Erro na finalização do pedido:", error);
      console.error("Status do erro:", error?.response?.status);
      console.error("Dados do erro:", error?.response?.data);

      if (error?.response?.status === 409) {
        // Pedido já finalizado ou conflito de status
        showToast("errorFinalize");
      } else {
        showToast("errorFinalize");
      }
    }
  };

  const cancelarPedido = async () => {
    try {
      setModalAberto(false);

      await alterarStatusPedido(pedidoId as string, "CANCELADO");

      showToast("successCancel");

      setTimeout(() => {
        router.push(`/pedidos`);
      }, 2000);
    } catch (error) {
      showToast("errorCancel");
    }
  };

  const pendentePedido = async () => {
    try {
      setModalAberto(false);

      const pedidoAtualizado = {
        idUsuario: pedido?.idUsuario as string,
        itens: pedido?.itens ? converterItensParaRequisicao(pedido.itens) : [],
      };

      console.log(
        "Corpo da requisição para editar pedido:",
        JSON.stringify(pedidoAtualizado, null, 2)
      );
      console.log("ID do pedido:", pedidoId);

      await editarPedido(pedidoId, pedidoAtualizado);

      showToast("successSave");

      setTimeout(() => {
        router.push(`/pedidos`);
      }, 3000);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        showToast("quantityError");
      } else {
        showToast("errorSave");
      }
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
              onSubmit={e => {
                e.preventDefault();
                if (!pedido) {
                  showToast("errorFinalize");
                  return;
                }
                finalizarPedidoHandler(pedidoId as string, {
                  desconto,
                  dataVenda: new Date(),
                });
              }}
              className="flex justify-center flex-col gap-2"
            >
              <p className="w-full text-center">Deseja finalizar o pedido?</p>

              <Input
                iconSymbol={<SellOutlined />}
                handleChange={e => {
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
          // Verificar se o pedido já está finalizado
          if (
            pedido?.status === "CONCLUIDO" ||
            pedido?.status === "FINALIZADO"
          ) {
            showToast("alreadyFinalized");
            return;
          }
          setModalTipo("finalizar");
          setModalAberto(true);
        }}
      />
    </div>
  );
}
