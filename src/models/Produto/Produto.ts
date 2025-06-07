export interface Produto {
  id: number;
  nome: string;
  sku: string;
  descricao: string;
  tag: string;
  quantidade: number;
  precoUnitario: number;
  valorVenda: number;
  catalogo: boolean;
  fornecedorId: number;
}

export type ProdutoCreate = Omit<Produto, 'id' | 'descricao'>;


