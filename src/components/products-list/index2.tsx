"use client";

import React, { useState, useEffect } from "react";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";
import { Produto } from "@/models/Produto";
import { Fornecedor } from "@/models/Marca";
import { ImagemProduto } from "@/models/ImagemProduto";
import Link from "next/link";
import ProductListItem from "../product-list-item";

interface ProductsListProps {
  produtos: Produto[];
  marca: Fornecedor;
}

export default function ProductsList({ produtos, marca }: ProductsListProps) {
  const [imagensPorProdutoId, setImagensPorProdutoId] = useState<Record<number, ImagemProduto>>({});

  useEffect(() => {
    if (!produtos.length) return;
  
    (async () => {
      try {
        const imagensList = await Promise.all(
          produtos.map((produto) => imagensPorProduto(produto.id))
        );
  
        const imagensMap = imagensList.reduce<Record<number, ImagemProduto>>((acc, imagens, index) => {
          const imagemPrincipal = imagens.find((img: ImagemProduto) => img.imagemPrincipal) || imagens[0];
          if (imagemPrincipal) {
            acc[produtos[index].id] = imagemPrincipal;
          }
          return acc;
        }, {});
  
        setImagensPorProdutoId(imagensMap);
      } catch (error) {
        console.error("Erro ao carregar imagens dos produtos:", error);
      }
    })();
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
