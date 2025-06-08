"use client";

import { useState, useEffect } from "react";

import ProductListItem from "../product-list-item";

import { imagensPorProduto } from "@/api/spring/services/ImagenService";

import { ProdutoHasImagens } from "@/models/Produto/ProdutoHasImagens";
import { ImagemProduto } from "@/models/Imagem/ImagemProduto";

import { Produto } from "@/models/Produto/Produto";

interface ProductsListProps {
  produtos: Produto[];
  onClick?: (produto: Produto) => void;
}

export default function ProductsOrdersList({
  produtos,
  onClick,
}: ProductsListProps) {
  const [produtosComImagens, setProdutosComImagens] = useState<
    ProdutoHasImagens[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const produtoComImagens = await Promise.all(
        produtos.map(async (produto) => {
          const imagens = await imagensPorProduto(produto.id);
          return {
            ...produto,
            imagens: imagens ?? [],
          };
        })
      );

      if (produtoComImagens) {
        setProdutosComImagens(produtoComImagens);
        console.log(produtoComImagens);
      }
    };

    fetchData();
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
        const imagemPrincipal = produto.imagens?.find(
          (img: ImagemProduto) => img.imagemPrincipal === true
        );

        return (
          <div key={produto.id} onClick={() => onClick?.(produto)}>
            <ProductListItem produto={produto} imagem={imagemPrincipal} />
          </div>
        );
      })}
    </div>
  );
}
