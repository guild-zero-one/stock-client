"use client";

import React from "react";
import { Produto } from "@/models/Produto/Produto";
import { Marca } from "@/models/Marca/Marca";
import Link from "next/link";
import ProductListItem from "../product-list-item";

interface ProductsListProps {
  produtos: Produto[];
  marca: Marca;
}

export default function ProductsList({ produtos, marca }: ProductsListProps) {
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
          <Link
            href={`/estoque/marcas/${marca.id}/produtos/${produto.id}`}
            key={produto.id}
          >
            <ProductListItem produto={produto} />
          </Link>
        );
      })}
    </div>
  );
}
