"use client";

import { useEffect, useState } from "react";
import { authMiddleware } from "@/middlewares/auth";

import { marcaPorId } from "@/api/spring/services/FornecedorService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";

import { Fornecedor } from "@/models/Marca";
import { Produto } from "@/models/Produto";

import { useParams } from "next/navigation";

import Header from "@/components/header";
import Input from "@/components/input";
import ProductsList from "@/components/products-list/index2";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

export default function ProdutosPage() {
  authMiddleware();

  const { marcaId } = useParams();
  const [marca, setMarca] = useState<Fornecedor>();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const fetchMarca = async () => {
      const marca = await marcaPorId(Number(marcaId));
      if (marca) {
        const produtos = await produtoPorMarca(Number(marcaId));

        setProdutos(produtos);
        setMarca(marca);
      }
    };
    fetchMarca();
  }, []);


  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header title="Estoque" subtitle={marca?.nome ?? "Carregando..."}>
        <DropdownAdd>
          <DropdownItem text="Editar Marca" icon={<EditIcon />} />
          <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
        </DropdownAdd>
      </Header>

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input name="search" label="Pesquisar" showIcon iconSymbol={<SearchIcon />} inputSize="small" />
      </div>

      {marca && (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtos} marca={marca} />
        </div>
      )}
    </div>
  );
}
