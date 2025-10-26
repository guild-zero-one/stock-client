// utils/formatarProduto.ts
import { ProdutoCreate } from "@/models/Produto/Produto";

const defaultProduto: ProdutoCreate = {
  nome: "",
  sku: "",
  descricao: "",
  tag: "",
  quantidade: 0,
  precoUnitario: 0,
  valorVenda: 0,
  catalogo: true,
  imagemUrl: "",
  idMarca: "",
};

export function formatarProduto(input: Partial<ProdutoCreate>): ProdutoCreate {
  const nome = (input.nome ?? "").trim();
  return {
    ...defaultProduto,
    ...input,
    nome,
    sku: (input.sku ?? "").trim(),
    descricao: nome.length > 0 ? nome : "Produto sem descrição",
    tag: (input.tag ?? "").trim(),
  };
}
