"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import ResumoProdutos from "./adicionarProdutos";

import { todasMarcas } from "@/api/spring/services/MarcaService";
import { listarProdutosPdf } from "@/api/gemini/services/PdfService";

import { Marca } from "@/models/Marca/Marca";
import { ProdutoCreate } from "@/models/Produto/Produto";

import { formatarProduto } from "@/utils/produtoFormatter";

import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import SelectPaginated from "@/components/select-paginated";
import ModalSearchImage from "@/components/modal-search-image";

import ImageIcon from "@mui/icons-material/Image";

export default function CriarProduto() {
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [newProduto, setNewProduto] = useState<Partial<ProdutoCreate>>({});
  const [produtos, setProdutos] = useState<ProdutoCreate[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcasPaginacao, setMarcasPaginacao] = useState({
    page: 0,
    hasMore: true,
    loading: false,
  });
  const { marcaId: idMarca } = useParams();
  const [showProdList, setShowProdList] = useState(false);
  const [modalImagem, setModalImagem] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setMarcasPaginacao(prev => ({ ...prev, loading: true }));
      try {
        const marcas = await todasMarcas(0, 20); // Carrega mais itens por página
        if (marcas) {
          setMarcas(marcas.content || []);
          setMarcasPaginacao({
            page: 0,
            hasMore: !marcas.last,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
        setMarcasPaginacao(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (idMarca) {
      setNewProduto(prev => ({
        ...prev,
        idMarca: idMarca as string,
      }));
    }
  }, [idMarca]);

  const handleProdutosChange = (novosProdutos: ProdutoCreate[]) => {
    setProdutos(novosProdutos);
  };

  const handleSelectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewProduto(prev => ({
      ...prev,
      idMarca: e.target.value,
    }));
  };

  const adicionarProdutoNaLista = () => {
    try {
      const produto = formatarProduto(newProduto);

      setProdutos(prev => [...prev, produto]);

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
        setProdutos(prev => [
          ...prev,
          ...produtosLidos.map(produto => formatarProduto(produto)),
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
    setNewProduto(prev => ({
      nome: "",
      sku: "",
      descricao: "",
      tag: "",
      quantidade: 0,
      precoUnitario: 0,
      valorVenda: 0,
      catalogo: true,
      idMarca: prev?.idMarca ?? "0",
    }));
  };

  const handleOpenModalImagem = () => {
    setModalImagem(true);
  };

  const handleCloseModalImagem = () => {
    setModalImagem(false);
  };

  const carregarMaisMarcas = async () => {
    if (marcasPaginacao.loading || !marcasPaginacao.hasMore) return;

    setMarcasPaginacao(prev => ({ ...prev, loading: true }));
    try {
      const proximaPage = marcasPaginacao.page + 1;
      const marcas = await todasMarcas(proximaPage, 20);

      if (marcas) {
        setMarcas(prev => [...prev, ...(marcas.content || [])]);
        setMarcasPaginacao({
          page: proximaPage,
          hasMore: !marcas.last,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar mais marcas:", error);
      setMarcasPaginacao(prev => ({ ...prev, loading: false }));
    }
  };

  return showProdList ? (
    <ResumoProdutos
      produtos={produtos}
      showProdList={showProdList}
      setShowProdList={setShowProdList}
      onProdutosChange={handleProdutosChange}
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
            {newProduto.imagemUrl ? (
              <img
                src={newProduto.imagemUrl}
                alt="Pré-visualização da imagem"
                className="rounded w-full h-full object-cover"
              />
            ) : (
              <ImageIcon fontSize="inherit" />
            )}
          </div>

          <Button
            label="Buscar Imagem"
            onClick={handleOpenModalImagem}
            variant="filled"
          />
        </div>
        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="product-name"
            handleChange={e =>
              setNewProduto({ ...newProduto, nome: e.target.value })
            }
            value={newProduto.nome ?? ""}
          />

          <Input
            label="SKU"
            name="product-sku"
            handleChange={e =>
              setNewProduto({ ...newProduto, sku: e.target.value })
            }
            value={newProduto.sku ?? ""}
          />

          <Input
            label="Descrição"
            name="product-descricao"
            handleChange={e =>
              setNewProduto({ ...newProduto, descricao: e.target.value })
            }
            value={newProduto.descricao ?? ""}
          />

          <SelectPaginated
            label="Marca"
            name="product-marca-name"
            value={String(newProduto.idMarca)}
            options={marcas}
            optionKey={"id"}
            optionName={"nome"}
            optionValue={"id"}
            handleChange={handleSelectedValue}
            onLoadMore={carregarMaisMarcas}
            hasMore={marcasPaginacao.hasMore}
            loading={marcasPaginacao.loading}
          />
          <div className="flex gap-2">
            <Input
              label="Preço Unitário"
              name="product-price"
              handleChange={e =>
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
              handleChange={e =>
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
              handleChange={e =>
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
          onSelect={file => {
            lerPdf(file);
          }}
          label="Enviar PDF"
          accept="application/pdf"
        />
      </div>

      <ModalSearchImage
        openModal={modalImagem}
        searchQuery={newProduto?.nome ?? ""}
        extraQuery="produto"
        onImageSelect={url => {
          setNewProduto(prev => ({
            ...prev,
            imagemUrl: url,
          }));
        }}
        onClose={handleCloseModalImagem}
      />
    </main>
  );
}
