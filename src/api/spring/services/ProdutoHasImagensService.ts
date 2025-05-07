// Service

import { Produto } from "@/models/Produto/Produto";
import { ImagemProduto } from "@/models/Imagem/ImagemProduto";
import { ProdutoHasImagens } from "@/models/Produto/ProdutoHasImagens";
import { produtoPorId } from "./ProdutoService";
import { imagensPorProduto } from "./ImagenService";

export const listarProdutoComImagensPorId = async (idProduto: number): Promise<ProdutoHasImagens> => {
  const produto: Produto = await produtoPorId(idProduto);
  const imagens: ImagemProduto[] = await imagensPorProduto(idProduto);

  return {
    ...produto,
    imagens,
  };
};


