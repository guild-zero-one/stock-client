"use client";

import { useEffect, useState } from "react";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import { produtoPorId } from "@/api/spring/services/ProdutoService";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";

import { Marca } from "@/models/Marca";
import { Produto } from "@/models/Produto";
import { ImagemProduto } from "@/models/ImagemProduto";

import { useParams } from "next/navigation";

import Header from "@/components/header";

const ProdutoPage = () => {
  const { marcaId } = useParams();
  const { produtoId } = useParams();

  const [marca, setMarca] = useState<Marca>();
  const [produto, setProduto] = useState<Produto>();
  const [imagem, setImagem] = useState<ImagemProduto>();

  useEffect(() => {
    const fetchData = async () => {
      const marca = await marcaPorId(Number(marcaId));
      if (marca) {
        setMarca(marca);
      }
      const produto = await produtoPorId(Number(produtoId));
      if (produto) {
        setProduto(produto);

        const imagens = await imagensPorProduto(produto.id);
        if (imagens) {
          const imagemPrincipal = imagens.find((img: ImagemProduto) => img.imagem_principal) || imagens[0];
          setImagem(imagemPrincipal);
        }
      }
    };
    fetchData();
  }, []); // tinha esquecido de colocar isso []
  return (
    <div className="w-full">
      {produto && marca && <Header title="Detalhes" subtitle={produto.nome} />}

      {/* Grid */}
      <div className="grid mx-auto px-4">
        <img src={imagem?.url_imagem} alt="" className="w-full object-contain" />

        {/* Card */}
        <div className="flex bg-white p-4 border border-gray-dark rounded-xl">
          {/* Text */}
          <div className="flex justify-between items-center w-full h-fit">
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs/1">{marca?.nome}</span>
              <h2 className="font-lexend text-base">{produto?.nome}</h2>
            </div>
            <div>
              <span className="font-lexend">R$ {produto?.valor_venda},00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProdutoPage;
