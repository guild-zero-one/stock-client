// Criando ProdutoHasImagens.ts
import {Produto } from "../Produto/Produto";
import { ImagemProduto } from "../Imagem/ImagemProduto";

export interface ProdutoHasImagens extends Produto {
    imagens: ImagemProduto[];
  }