export interface Produto {
  id: string;
  nome: string;
  sku: string;
  descricao: string;
  tag: string;
  quantidade: number;
  precoUnitario: number;
  catalogo: boolean;
  valorVenda: number;
  imagemUrl: string;
  idMarca: string;
}

export type ProdutoCreate = Omit<Produto, "id"> & {
  imagem?: File;
};
