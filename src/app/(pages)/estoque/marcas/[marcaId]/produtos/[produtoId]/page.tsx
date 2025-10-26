"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import {
  atualizarProduto,
  produtoPorId,
} from "@/api/spring/services/ProdutoService";
import { validateProductId } from "@/utils/uuidValidator";

import { Marca } from "@/models/Marca/Marca";
import { Produto, ProdutoCreate } from "@/models/Produto/Produto";

import Header from "@/components/header";
import BadgeInline from "@/components/badge-inline";
import Switch from "@/components/switch";
import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/modal-popup";
import ModalSearchImage from "@/components/modal-search-image";
import Toast from "@/components/toast";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { AssignmentTurnedInOutlined } from "@mui/icons-material";

export default function ProdutoPage() {
  const { produtoId, marcaId: idMarca } = useParams();

  const [marca, setMarca] = useState<Marca>();
  const [produto, setProduto] = useState<Produto>();

  const [newProduto, setNewProduto] = useState<Partial<ProdutoCreate>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [modalImagem, setModalImagem] = useState(false);
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [toast, setToast] = useState<"success" | "error" | null>(null);

  const router = useRouter();

  // Toast config
  const showToast = (type: "success" | "error" | null) => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };
  const toastMap = {
    success: {
      title: "Produto atualizado com sucesso",
      message: "Você será redirecionado para o estoque",
      type: "success",
    },
    error: {
      title: "Erro ao atualizar produto",
      message: "Verifique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marca = await marcaPorId(idMarca as string);
        if (marca) setMarca(marca);

        // Validação do produtoId antes de fazer a chamada
        if (!validateProductId(produtoId as string)) {
          console.error("ID do produto inválido:", produtoId);
          showToast("error");
          return;
        }

        const produto = await produtoPorId(produtoId as string);
        if (produto) {
          setProduto(produto);

          // Ao carregar o produto, inicializa o objeto de edição
          setNewProduto({
            nome: produto.nome,
            sku: produto.sku,
            descricao: produto.descricao,
            quantidade: produto.quantidade,
            precoUnitario: produto.precoUnitario,
            valorVenda: produto.valorVenda,
            catalogo: produto.catalogo,
            imagemUrl: produto.imagemUrl,
          });

          // Carrega imagens do produto
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast("error");
      }
    };
    fetchData();
  }, [idMarca, produtoId]);

  const handleCatalogo = () =>
    newProduto?.catalogo ? " Habilitado" : " Desabilitado";

  const handleOpenModalImagem = () => {
    const nomeAtual = newProduto?.nome ?? produto?.nome ?? "";
    if (!nomeAtual.trim()) {
      setShowNameValidation(true);
      return;
    }
    setModalImagem(true);
  };

  const handleCloseModalImagem = () => setModalImagem(false);

  const handleImageError = () => {
    setNewProduto(prev => ({
      ...prev,
      imagemUrl: "",
    }));
  };

  const updateProduto = async () => {
    if (!produto) return;

    setModalAberto(false);

    try {
      await atualizarProduto(produto.id, {
        ...produto,
        ...newProduto,
      });

      showToast("success");

      setTimeout(() => {
        router.push(`/estoque/marcas`);
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      showToast("error");
    }
  };

  return (
    <div className="w-full">
      {toast && <Toast {...toastMap[toast]} />}

      {produto && marca && <Header title="Detalhes" subtitle={produto.nome} />}

      {/* Grid */}
      <div className="gap-4 grid mx-auto px-2 pb-1">
        {/* Imagem principal */}
        {newProduto?.imagemUrl || produto?.imagemUrl ? (
          <img
            src={newProduto?.imagemUrl || produto?.imagemUrl}
            alt="Imagem do produto"
            className="w-full object-contain"
            onError={handleImageError}
          />
        ) : (
          <div className="flex justify-center items-center bg-gray-200 w-full h-80 animate-pulse">
            <span className="text-gray-400">Carregando imagem...</span>
          </div>
        )}

        {/* Card Descrição */}
        <div className="flex flex-col gap-2 bg-white p-4 border border-gray-dark rounded-xl">
          {/* Produto Nome, Valor e Marca */}
          <div className="flex justify-between items-center w-full h-fit">
            <div className="flex flex-col">
              <span className="text-text-secondary text-xs/1">
                {marca?.nome}
              </span>
              <h2 className="font-lexend text-lg">{produto?.nome}</h2>
            </div>
            <div>
              <span className="font-lexend">
                R$ {produto?.valorVenda?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Produto Unidades, Catalogo e ID  */}
          <div className="flex flex-col gap-1 text-text-secondary text-sm">
            <div className="flex items-center gap-1">
              <Inventory2OutlinedIcon fontSize="medium" />
              <BadgeInline value={produto?.quantidade} />
              <span>Unidades em Estoque</span>
            </div>

            <div className="flex items-center gap-1">
              <LocalOfferOutlinedIcon fontSize="medium" />
              <span>
                Catalogo
                <span
                  className={`${
                    newProduto?.catalogo
                      ? "text-ok-default"
                      : "text-error-default"
                  }`}
                >
                  {handleCatalogo()}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-text-desactive text-xs">{`Código ${produto?.id}`}</span>
            </div>
          </div>
        </div>

        {/* Inputs de edição */}
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="product-name"
            handleChange={e => {
              setNewProduto(prev => ({ ...prev, nome: e.target.value }));
              if (showNameValidation && e.target.value.trim()) {
                setShowNameValidation(false);
              }
            }}
            value={newProduto?.nome ?? ""}
            showHelper={showNameValidation}
            status={showNameValidation ? "error" : "default"}
            messageHelper="Nome do produto é obrigatório para buscar imagens"
          />

          <Input
            label="SKU"
            name="product-sku"
            handleChange={e =>
              setNewProduto(prev => ({ ...prev, sku: e.target.value }))
            }
            value={newProduto?.sku ?? ""}
          />

          <Input
            label="Descrição"
            name="product-description"
            handleChange={e =>
              setNewProduto(prev => ({ ...prev, descricao: e.target.value }))
            }
            value={newProduto?.descricao ?? ""}
          />

          <div className="flex gap-2">
            <Input
              label="Preço Unitário"
              name="product-price"
              handleChange={e =>
                setNewProduto(prev => ({
                  ...prev,
                  precoUnitario: Number(e.target.value),
                }))
              }
              value={newProduto?.precoUnitario ?? ""}
            />
            <Input
              label="Preço Venda"
              name="product-price"
              handleChange={e =>
                setNewProduto(prev => ({
                  ...prev,
                  valorVenda: Number(e.target.value),
                }))
              }
              value={newProduto?.valorVenda ?? ""}
            />
            <Input
              label="Quant."
              name="product-quant"
              handleChange={e =>
                setNewProduto(prev => ({
                  ...prev,
                  quantidade: Number(e.target.value),
                }))
              }
              value={newProduto?.quantidade ?? ""}
            />
          </div>
        </div>

        {/* Modal de confirmação */}
        <Modal
          open={modalAberto}
          icon={<AssignmentTurnedInOutlined fontSize="inherit" />}
          onClose={() => setModalAberto(false)}
          title={<p>Confirmar edição do produto</p>}
          body={
            <div className="flex flex-col gap-4 justify-center">
              <p className="w-full text-center">
                Tem certeza que deseja{" "}
                <span className="font-bold text-pink-default">
                  salvar as alterações
                </span>{" "}
                deste produto?
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  onClick={() => setModalAberto(false)}
                  fullWidth
                  label="Cancelar"
                  variant="outlined"
                />
                <Button
                  onClick={updateProduto}
                  fullWidth
                  label="Sim, salvar edição"
                />
              </div>
            </div>
          }
        />

        {/* Footer: Switch + Imagem + Salvar */}
        <footer className="flex justify-between w-full">
          <div>
            <p className="text-text-secondary text-xs">Exibição do catálogo</p>
            <Switch
              id="catalogo"
              onChange={() =>
                setNewProduto(prev => ({
                  ...prev,
                  catalogo: !prev.catalogo,
                }))
              }
              checked={!!newProduto.catalogo}
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Buscar Imagem"
              size="default"
              variant="filled"
              onClick={handleOpenModalImagem}
            />
            <Button
              label="Editar Produto"
              onClick={() => setModalAberto(true)}
            />
          </div>
        </footer>
      </div>

      <ModalSearchImage
        openModal={modalImagem}
        searchQuery={newProduto?.nome ?? produto?.nome ?? ""}
        extraQuery="produto"
        onImageSelect={url => {
          setNewProduto(prev => ({
            ...prev,
            imagemUrl: url,
          }));
        }}
        onClose={handleCloseModalImagem}
      />
    </div>
  );
}
