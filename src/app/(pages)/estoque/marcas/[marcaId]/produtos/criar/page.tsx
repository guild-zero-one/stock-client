"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import ResumoProdutos from "./adicionarProdutos";

import { todasMarcas } from "@/api/spring/services/FornecedorService";
import { listarProdutosPdf } from "@/api/gemini/services/PdfService";

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { ProdutoCreate } from "@/models/Produto/Produto";

import { formatarProduto } from "@/utils/produtoFormatter";

import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import Select from "@/components/select";

import ImageIcon from "@mui/icons-material/Image";

export default function CriarProduto() {
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [newProduto, setNewProduto] = useState<Partial<ProdutoCreate>>({});
  const [produtos, setProdutos] = useState<ProdutoCreate[]>([]);
  const [marcas, setMarcas] = useState<Fornecedor[]>([]);
  const { marcaId } = useParams();
  const [showProdList, setShowProdList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const marcas = await todasMarcas();
      if (marcas) {
        setMarcas(marcas);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const id = parseInt(marcaId as string);
    if (!isNaN(id)) {
      setNewProduto((prev) => ({
        ...prev,
        fornecedorId: id,
      }));
    }
  }, [marcaId]);

  const handleSelectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewProduto((prev) => ({
      ...prev,
      fornecedorId: parseInt(e.target.value),
    }));
  };

  const adicionarProdutoNaLista = () => {
    try {
      const produto = formatarProduto(newProduto);

      setProdutos((prev) => [...prev, produto]);

      resetForm();
      setShowProdList(true);
    } catch (error) {
      console.error(error);
    }
  };

  const lerPdf = async (file: File | null) => {
    if (!file) return;

    setLoadingPdf(true);

    try {
      const produtosLidos = await listarProdutosPdf(file);

      if (produtosLidos) {
        setProdutos((prev) => [
          ...prev,
          ...produtosLidos.map((produto) => formatarProduto(produto)),
        ]);
      }

      resetForm();
      setShowProdList(true);
      setLoadingPdf(false);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewProduto((prev) => ({
      nome: "",
      sku: "",
      tag: "",
      quantidade: 0,
      precoUnitario: 0,
      valorVenda: 0,
      catalogo: true,
      fornecedorId: prev?.fornecedorId ?? 0,
    }));
  };

  return showProdList ? (
    <ResumoProdutos
      produtos={produtos}
      showProdList={showProdList}
      setShowProdList={setShowProdList}
    />
  ) : (
    <main className="relative flex flex-col w-full min-h-screen">
      <Header title="Adicionar" subtitle="Produto" />

      {loadingPdf && (
        <div className="flex items-center justify-center w-full py-4">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-default mr-2"></span>
          <span className="text-pink-default">Processando PDF, aguarde...</span>
        </div>
      )}

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex justify-between">
          <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl">
            {newProduto.imagem ? (
              <img
                src={URL.createObjectURL(newProduto.imagem)}
                alt="Pré-visualização da imagem"
                className="rounded w-full h-full object-cover"
              />
            ) : (
              <ImageIcon fontSize="inherit" />
            )}
          </div>

          <ButtonFile
            id="adicionar-imagem"
            onSelect={(file) => {
              setNewProduto((prev) => ({
                ...prev,
                imagem: file ?? undefined,
              }));
            }}
            label="Adicionar Imagem"
            accept="image/*"
            message
          />
        </div>
        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="product-name"
            handleChange={(e) =>
              setNewProduto({ ...newProduto, nome: e.target.value })
            }
            value={newProduto.nome ?? ""}
          />

          <Input
            label="SKU"
            name="product-sku"
            handleChange={(e) =>
              setNewProduto({ ...newProduto, sku: e.target.value })
            }
            value={newProduto.sku ?? ""}
          />

          <Select
            label="Marca"
            name="product-marca-name"
            value={String(newProduto.fornecedorId)}
            options={marcas}
            optionKey={"id"}
            optionName={"nome"}
            optionValue={"id"}
            handleChange={handleSelectedValue}
          />
          <div className="flex gap-2">
            <Input
              label="Preço Unitário"
              name="product-price"
              handleChange={(e) =>
                setNewProduto({
                  ...newProduto,
                  precoUnitario: Number(e.target.value),
                })
              }
              value={newProduto.precoUnitario ?? ""}
            />
            <Input
              label="Preço Venda"
              name="product-price"
              handleChange={(e) =>
                setNewProduto({
                  ...newProduto,
                  valorVenda: Number(e.target.value),
                })
              }
              value={newProduto.valorVenda ?? ""}
            />
            <Input
              label="Quant."
              name="product-quant"
              handleChange={(e) =>
                setNewProduto({
                  ...newProduto,
                  quantidade: Number(e.target.value),
                })
              }
              value={newProduto.quantidade ?? ""}
            />
          </div>
        </div>
        {/* Button */}
        <Button
          label={"Avançar"}
          fullWidth
          variant="outlined"
          onClick={adicionarProdutoNaLista}
          type="button"
        />
        <ButtonFile
          id="ler-pdf"
          onSelect={(file) => {
            lerPdf(file);
          }}
          label="Enviar PDF"
          accept="application/pdf"
        />
      </div>
    </main>
  );
}
