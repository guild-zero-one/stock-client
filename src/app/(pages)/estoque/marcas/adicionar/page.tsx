"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { useRouter } from "next/navigation";

import { searchMultipleImages } from "@/api/serpapi/services/SearchService";
import { criarFornecedor } from "@/api/spring/services/FornecedorService";

import axios from "axios";
import Button from "@/components/button";
import Modal from "@/components/modal-popup";
import Header from "@/components/header";
import Input from "@/components/input";
import Toast from "@/components/toast";
import ImageIcon from "@mui/icons-material/Image";

export default function CriarMarca() {
  const [toast, setToast] = useState<null | "success" | "error" | "conflict">(
    null
  );

  const showToast = (type: "success" | "error" | "conflict") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [modal, setModal] = useState(false);
  // Estado para imagens do modal
  const [images, setImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imagesPage, setImagesPage] = useState(0);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const handleOpen = () => {
    setModal(true);
    setImages([]);
    setImagesPage(0);
    setHasMoreImages(true);
  };
  const handleClose = () => setModal(false);

  // Função para buscar imagens
  const fetchImages = useCallback(async (reset = false) => {
    if (loadingImages || (!hasMoreImages && !reset)) return;
    setLoadingImages(true);
    try {
      const pageToFetch = reset ? 0 : imagesPage;
      const imgs = await searchMultipleImages(nome + " logo png"|| "marca", 9, pageToFetch);
      if (imgs.length < 9) setHasMoreImages(false);
      if (reset) {
        setImages(imgs);
        setImagesPage(1);
      } else {
        setImages(prev => [...prev, ...imgs]);
        setImagesPage(prev => prev + 1);
      }
    } catch (e) {
      setHasMoreImages(false);
    } finally {
      setLoadingImages(false);
    }
  }, [nome, imagesPage, loadingImages, hasMoreImages]);

  // Buscar imagens ao abrir o modal ou mudar o nome
  useEffect(() => {
    if (modal) {
      fetchImages(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, nome]);

  // Handler de scroll do grid
  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchImages();
    }
  };

  // Selecionar imagem (prefere thumbnail para preview, fallback para original)
  const handleSelectImage = (img: any) => {
    const chosen = img.thumbnail || img.original || "";
    setUrlImagem(chosen);
    setModal(false);
  };
  const handleImageError = () => {
    // Chamar a função de fallback do componente
    // limpar preview para não mostrar o alt text
    setUrlImagem("");
  };

  const toastMap = {
    success: {
      title: "Marca adicionada com sucesso",
      message: "Você será redirecionado para a lista de marcas.",
      type: "success",
    },
    conflict: {
      title: "Erro ao criar marca",
      message: "Marca já cadastrada.",
      type: "error",
    },
    error: {
      title: "Erro ao criar marca",
      message: "Verifique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const router = useRouter();

  const criarMarca = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const fornecedor = {
        nome,
        descricao,
        cnpj,
        imagemUrl: urlImagem,
      };

      await criarFornecedor(fornecedor);

      showToast("success");

      setTimeout(() => {
        router.push("/estoque/marcas");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

      }
      showToast("error");
    }
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen">
      {toast && <Toast {...toastMap[toast]} />}

      <Header backRouter="/estoque/marcas" title="Adicionar" subtitle="Marca" />

      {/* Grid */}
      <form
        onSubmit={criarMarca}
        className="flex flex-col gap-4 p-4 w-full"
        autoComplete="off"
      >
        <div className="flex justify-between">
          <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl bg-white">
            {urlImagem ? (
              <img
                src={urlImagem}
                alt="Pré-visualização da imagem"
                className="rounded w-full h-full object-contain object-center"
                onError={handleImageError}
              />
            ) : (
              <ImageIcon fontSize="inherit" />
            )}
          </div>

        <Button
          label={"Adicionar imagem"}
          size="default"
          variant="filled"
          onClick={handleOpen}
        />

        </div>
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input
            label="Nome"
            name="marca-name"
            handleChange={(e) => {
              setNome(e.target.value);
              if (showNameValidation && e.target.value.trim()) {
                setShowNameValidation(false);
              }
            }}
            value={nome}
            showHelper={showNameValidation}
            status={showNameValidation ? "error" : "default"}
            messageHelper="Nome da marca é obrigatório para buscar imagens"
          />
          <Input
            label="Descrição"
            name="marca-description"
            handleChange={(e) => setDescricao(e.target.value)}
            value={descricao}
          />
          <Input
            label="CNPJ"
            name="marca-cnpj"
            handleChange={(e) => setCnpj(e.target.value)}
            value={cnpj}
          />
        </div>

        {/* Button */}
        <Button label="Adicionar Marca" fullWidth type="submit" />
      </form>

      <Modal
        open={modal}
        onClose={handleClose}
        title={<span>Escolha uma imagem</span>}
        body={
          <div
            className="w-full hide-scrollbar max-h-[60vh] overflow-y-auto"
            onScroll={handleModalScroll}
          >
            <div className="grid grid-cols-3 gap-2 p-2">
              {images.filter(i => i && (i.thumbnail || i.original)).map((img, idx) => (
                <button
                  key={`${img.original || 'img'}-${idx}`}
                  className="aspect-square border rounded overflow-hidden hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white w-full border-gray-dark"
                  type="button"
                  onClick={() => handleSelectImage(img)}
                  tabIndex={0}
                >
                  <img
                    src={img.thumbnail || img.original}
                    alt={img.title || "Imagem"}
                    className="w-full h-full object-contain"
                    onError={() => setUrlImagem("")}
                  />
                </button>
              ))}
            </div>
            {loadingImages && (
              <div className="text-center py-2 text-gray-500">Carregando...</div>
            )}
            {!loadingImages && images.length === 0 && (
              <div className="text-center py-2 text-gray-500">Nenhuma imagem encontrada</div>
            )}
          </div>
        }
        footer={
          <Button label="Cancelar" fullWidth variant="outlined" onClick={handleClose} />
        }
      />
    </main>
  );
}
