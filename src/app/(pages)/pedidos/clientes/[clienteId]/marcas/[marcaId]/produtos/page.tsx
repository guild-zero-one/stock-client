"use client";

import { useEffect, useMemo, useState } from "react";

import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { Produto } from "@/models/Produto/Produto";

import { useParams } from "next/navigation";

import Header from "@/components/header";
import Input from "@/components/input";
import ProductsList from "@/components/products-list";

import SearchIcon from "@mui/icons-material/Search";

export default function EscolherProduto() {
  const [fornecedor, setFornecedor] = useState<Fornecedor>();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [inputPesquisar, setInputPesquisar] = useState("");

  const { marcaId } = useParams();
  const { clienteId } = useParams();

  useEffect(() => {
    const fetchFornecedor = async () => {
      const fornecedor = await marcaPorId(Number(marcaId));
      if (fornecedor) {
        const produtos = await produtoPorMarca(Number(marcaId));
        setProdutos(produtos);
        setFornecedor(fornecedor);
      }
    };
    fetchFornecedor();
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = inputPesquisar.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termo)
    );
  }, [produtos, inputPesquisar]);

  return (
    <div className="flex flex-col w-full min-h-dvh bg-white-default">
      <Header title="Escolher Produto" subtitle="Adicionar Pedido" />

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          iconSymbol={<SearchIcon />}
          size="small"
          handleChange={(e) => setInputPesquisar(e.target.value)}
        />
      </div>

      {/* Lista de Produtos */}
      {produtosFiltrados.length > 0 && fornecedor ? (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtosFiltrados} fornecedor={fornecedor} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Nenhum produto encontrado :(</p>
        </div>
      )}
    </div>
  );
}
