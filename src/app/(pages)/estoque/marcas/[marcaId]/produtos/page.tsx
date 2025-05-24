"use client";

import { useEffect, useState } from "react";

import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { Produto } from "@/models/Produto/Produto";

import { useParams } from "next/navigation";

import Header from "@/components/header";
import Input from "@/components/input";
import ProductsList from "@/components/products-list";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

export default function ProdutosPage() {

  const { marcaId } = useParams();
  const [fornecedor, setFornecedor] = useState<Fornecedor>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [inputPesquisar, setInputPesquisar] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputPesquisar(value);
  };

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

  const produtosFiltrados = produtos.filter((produto) => produto
    .nome
    .toLowerCase()
    .includes(inputPesquisar
      .toLowerCase()
      .trim()));

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header title="Estoque" subtitle={fornecedor?.nome ?? "Carregando..."}>
        <DropdownAdd>
          <DropdownItem text="Editar Marca" icon={<EditIcon />} />
          <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
        </DropdownAdd>
      </Header>

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input name="search" label="Pesquisar" iconSymbol={<SearchIcon />} handleChange={handleSearchChange} />
      </div>

      {inputPesquisar.length === 0 ? (

        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtos} fornecedor={fornecedor!} />
        </div>

      ) : produtosFiltrados.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtosFiltrados} fornecedor={fornecedor!} />
        </div>

      ) : (
        <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
          <h2 className="italic">Nenhum produto encontrado</h2>
        </div>
      )}



    </div>
  );
}
