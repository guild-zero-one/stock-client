// Criando ProdutoHasImagens.ts
import {Produto } from "./Produto";
import { ImagemProduto } from "./ImagemProduto";


export interface ProdutoHasImagens extends Produto {
    imagens: ImagemProduto[];
  }