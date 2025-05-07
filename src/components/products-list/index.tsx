"use client";

import React, { useState, useEffect } from "react";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";
import { Produto } from "@/models/Produto/Produto";
import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import Link from "next/link";
import ProductListItem from "../product-list-item";
import { ProdutoHasImagens } from "@/models/Produto/ProdutoHasImagens";
import { ImagemProduto } from "@/models/Imagem/ImagemProduto";

interface ProductsListProps {
  produtos: Produto[];
  fornecedor: Fornecedor;
}

export default function ProductsList({ produtos, fornecedor }: ProductsListProps) {
  const [produtosComImagens, setProdutosComImagens] = useState<ProdutoHasImagens[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const produtoComImagens = await Promise.all(
        produtos.map(async (produto) => {
          const imagens = await imagensPorProduto(produto.id);
          return {
            ...produto,
            imagens: imagens ?? [], // evita criar array de arrays
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
        console.log("produto: ", produto);
        const imagemPrincipal = produto.imagens?.find(
          (img: ImagemProduto) => img.imagemPrincipal === true
        );

        console.log("principal: ", imagemPrincipal);
        return (
          <Link href={`/estoque/marcas/${fornecedor.id}/produtos/${produto.id}`} key={produto.id}>
            <ProductListItem produto={produto} imagem={imagemPrincipal} />
          </Link>
        );
      })}
    </div>
  );
}
