"use client";

import React, { useState, useEffect } from "react";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";
import { Produto } from "@/models/Produto";
import { Marca } from "@/models/Marca";
import { ImagemProduto } from "@/models/ImagemProduto";
import Link from "next/link";
import ProductListItem from "../product-list-item";

interface ProductsListProps {
  produtos: Produto[];
  marca: Marca;
}

export default function ProductsList({ produtos, marca }: ProductsListProps) {
  const [imagensPorProdutoId, setImagensPorProdutoId] = useState<Record<number, ImagemProduto>>({});

  useEffect(() => {
    // Carrega todas as imagens quando o componente montar
    const carregarImagens = async () => {
      const imagensMap: Record<number, ImagemProduto> = {};

      for (const produto of produtos) {
        const imagens = await imagensPorProduto(produto.id);
        if (imagens && imagens.length > 0) {
          const imagemPrincipal = imagens.find((img: ImagemProduto) => img.imagem_principal) || imagens[0];
          imagensMap[produto.id] = imagemPrincipal;
        }
      }

      setImagensPorProdutoId(imagensMap);
    };

    carregarImagens();
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
      {produtos.map((produto) => (
        <Link href={`/estoque/marcas/${marca.id}/produtos/${produto.id}`} key={produto.id}>
          <ProductListItem produto={produto} imagem={imagensPorProdutoId[produto.id]} />
        </Link>
      ))}
    </div>
  );
}
