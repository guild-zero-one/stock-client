// utils/formatarProduto.ts
import { ProdutoCreate } from "@/models/Produto/Produto";

const defaultProduto: ProdutoCreate = {
  nome: "",
  sku: "",
  tag: "",
  quantidade: 0,
  precoUnitario: 0,
  valorVenda: 0,
  fornecedorId: 0,
  catalogo: true,
};

export function formatarProduto(input: Partial<ProdutoCreate>): ProdutoCreate {
  return {
    ...defaultProduto,
    ...input,
    nome: (input.nome ?? "").trim(),
    sku: (input.sku ?? "").trim(),
    tag: (input.tag ?? "").trim(),
  };
}
