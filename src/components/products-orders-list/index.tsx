"use client";

import ProductListItem from "../product-list-item";
import { Produto } from "@/models/Produto/Produto";

interface ProductsListProps {
  produtos: Produto[];
  onClick?: (produto: Produto) => void;
}

export default function ProductsOrdersList({
  produtos,
  onClick,
}: ProductsListProps) {
  if (!produtos || produtos.length === 0) {
    return (
      <div className="p-4 w-full text-center">
        <h2 className="text-gray-500">Sem produtos disponíveis</h2>
      </div>
    );
  }

  return (
    <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {produtos.map(produto => {
        return (
          <div key={produto.id} onClick={() => onClick?.(produto)}>
            <ProductListItem produto={produto} />
          </div>
        );
      })}
    </div>
  );
}
