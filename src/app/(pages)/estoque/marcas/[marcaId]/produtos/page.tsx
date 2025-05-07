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

  useEffect(() => {
    const fetchFornecedor = async () => {
      const fornecedor = await marcaPorId(Number(marcaId));
      if (fornecedor) {
        const produtos = await produtoPorMarca(Number(marcaId));

        setProdutos(produtos);
        setFornecedor(fornecedor);
        console.log("Fornecedor: ", fornecedor.nome)
        console.log("Produtos: ", produtos)
      }
    };
    fetchFornecedor();
  }, []);


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
        <Input name="search" label="Pesquisar" showIcon iconSymbol={<SearchIcon />} inputSize="small" />
      </div>

      {fornecedor && (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtos} fornecedor={fornecedor} />
        </div>
      )}
    </div>
  );
}
