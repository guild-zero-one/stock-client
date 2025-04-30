export interface Produto {
  id: number;
  nome: string;
  desc: string;
  valorVenda: number;
  precoUnitario: number;
  quantidade: number;
  catalogo: boolean;
  fornecedorId: number;
}
