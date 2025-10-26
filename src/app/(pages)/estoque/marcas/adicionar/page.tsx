"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { criarMarca as criarMarcaService } from "@/api/spring/services/MarcaService";

import axios from "axios";
import Button from "@/components/button";
import Header from "@/components/header";
import Input from "@/components/input";
import Toast from "@/components/toast";
import ImageIcon from "@mui/icons-material/Image";
import ModalSearchImage from "@/components/modal-search-image";

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
  const [urlImagem, setUrlImagem] = useState("");
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [modal, setModal] = useState(false);

  const handleOpen = () => {
    setModal(true);
  };
  const handleClose = () => setModal(false);

  const handleImageError = () => {
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
      const marca = {
        nome,
        descricao,
        imagemUrl: urlImagem,
      };

      await criarMarcaService(marca);

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
            handleChange={e => {
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
            handleChange={e => setDescricao(e.target.value)}
            value={descricao}
          />
        </div>

        {/* Button */}
        <Button label="Adicionar Marca" fullWidth type="submit" />
      </form>

      <ModalSearchImage
        openModal={modal}
        searchQuery={nome}
        extraQuery="marca logo"
        onImageSelect={url => setUrlImagem(url)}
        onClose={() => handleClose()}
      />
    </main>
  );
}
