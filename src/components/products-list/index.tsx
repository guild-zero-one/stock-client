"use client";

import React, { useState, useEffect } from "react";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";
import { Produto } from "@/models/Produto";
import { Fornecedor } from "@/models/Marca";
import Link from "next/link";
import ProductListItem from "../product-list-item";
import { ProdutoHasImagens } from "@/models/ProdutoHasImagens";

interface ProductsListProps {
  produtos: Produto[];
  marca: Fornecedor;
}

export default function ProductsList({ produtos, marca }: ProductsListProps) {
  const [produtosComImagens, setProdutosComImagens] = useState<ProdutoHasImagens[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const produtoComImagens = await Promise.all(
        produtos.map(async (produto) => {
          const imagens = await imagensPorProduto(produto.id);
          return {
            ...produto,
            imagens,
          };
        })
      );
      setProdutosComImagens(produtoComImagens);
    };

    if (produtos.length > 0) {
      fetchData();
    }
  }, [produtos]);

  if (!produtos || produtos.length === 0) {
    return (
      <div className="p-4 w-full text-center">
        <h2 className="text-gray-500">Sem produtos disponíveis</h2>
      </div>
    );
  }

  return (
    <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {produtosComImagens.map((produto) => {
        const imagemPrincipal = produto.imagens.find((img) => img.imagemPrincipal);
        return (
          <Link href={`/estoque/marcas/${marca.id}/produtos/${produto.id}`} key={produto.id}>
            <ProductListItem produto={produto} imagem={imagemPrincipal} />
          </Link>
        );
      })}
    </div>
  );
}
