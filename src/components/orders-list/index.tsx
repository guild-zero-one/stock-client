"use client";

import { PedidoHasProduto } from "@/models/Pedido/PedidoHasProduto";

import DetailBrand from "@/components/detail-brand";
import CardProduct from "@/components/card-product";

interface OrdersListProps {
  pedido: PedidoHasProduto;
  atualizar?: (produtoId: number, novaQtd: number) => void;
  deletar?: (produtoId: number) => void;
}

export default function OrdersList({
  pedido,
  atualizar,
  deletar,
}: OrdersListProps) {
  const produtosPorMarca = pedido.itens.reduce<
    Record<string, typeof pedido.itens>
  >((acc, item) => {
    const marca = item.fornecedor?.nome ?? "Sem marca";
    if (!acc[marca]) acc[marca] = [];
    acc[marca].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-white-default relative">
      <div className="flex-grow overflow-y-auto p-4 pb-24 flex flex-col gap-6">
        {Object.keys(produtosPorMarca).length === 0 ? (
          <p className="text-center text-gray-500">Sem produtos no pedido :(</p>
        ) : (
          Object.entries(produtosPorMarca).map(([marca, lista]) => (
            <div key={marca} className="flex flex-col gap-4">
              <DetailBrand marca={marca} quantidadeMarca={lista.length} />

              {lista.map((item, index) => (
                <CardProduct
                  key={index}
                  produtoId={item.produto.id}
                  nome={item.produto.nome}
                  precoUnitario={item.item.precoUnitario}
                  quantidade={item.item.quantidade}
                  imagemUrl={item.produto.imagemUrl ?? ""}
                  atualizar={atualizar}
                  deletar={deletar}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
