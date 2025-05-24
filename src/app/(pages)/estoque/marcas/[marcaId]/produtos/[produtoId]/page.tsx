"use client";

import { useEffect, useState } from "react";

import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { produtoPorId } from "@/api/spring/services/ProdutoService";
import { imagensPorProduto } from "@/api/spring/services/ImagenService";

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { Produto } from "@/models/Produto/Produto";
import { ImagemProduto } from "@/models/Imagem/ImagemProduto";

import { useParams } from "next/navigation";

import Header from "@/components/header";
import BadgeInline from "@/components/badge-inline";

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const ProdutoPage = () => {
  const { marcaId } = useParams();
  const { produtoId } = useParams();

  const [marca, setMarca] = useState<Fornecedor>();
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
          const imagemPrincipal = imagens.find((img: ImagemProduto) => img.imagemPrincipal) || imagens[0];
          setImagem(imagemPrincipal);
        }
      }
    };
    fetchData();
  }, []);

  const handleCatalogo = () => {
    return produto?.catalogo ? " Habilitado" : " Desabilitado"
  }
  return (
    <div className="w-full">
      {produto && marca && <Header title="Detalhes" subtitle={produto.nome} />}

      {/* Grid */}
      <div className="grid mx-auto px-4">

        {imagem?.urlImagem ? (
          <img
            src={imagem.urlImagem}
            alt="Imagem do produto"
            className="w-full object-contain"
          />
        ) : (
          <div className="flex justify-center items-center bg-gray-200 w-full h-80 animate-pulse">
            <span className="text-gray-400">Carregando imagem...</span>
          </div>
        )}


        {/* Card */}
        <div className="flex flex-col gap-2 bg-white p-4 border border-gray-dark rounded-xl">
          {/* Text */}
          <div className="flex justify-between items-center w-full h-fit">
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs/1">{marca?.nome}</span>
              <h2 className="font-lexend text-lg">{produto?.nome}</h2>
            </div>
            <div>
              <span className="font-lexend">R$ {produto?.valorVenda},00</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-text-secondary text-sm">
            <div className="flex gap-1">
              <Inventory2OutlinedIcon fontSize="small" />
              <BadgeInline>{produto?.quantidade}</BadgeInline>
              <span>Unidades em Estoque</span>
            </div>

            <div className="flex gap-1">
              <ShoppingBagOutlinedIcon fontSize="small" />
              <BadgeInline>10</BadgeInline>
              <span>Pedidos Pedentes</span>
            </div>

            <div className="flex gap-1">
              <LocalOfferOutlinedIcon fontSize="small" />
              <span>Catalogo
                <span className={`${produto?.catalogo ? "text-ok-default" : "text-error-default"}`}>
                  {handleCatalogo()}
                </span>
              </span>
            </div>
            <div className="flex gap-1">
              <span className="text-text-desactive text-xs">{`Código ${produto?.id}`}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default ProdutoPage;
