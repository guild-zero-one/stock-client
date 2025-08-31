"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";

import { marcaPorId, atualizarFornecedor } from "@/api/spring/services/FornecedorService";
import { Fornecedor } from "@/models/Fornecedor/Fornecedor";

import Button from "@/components/button";
// import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import Toast from "@/components/toast";

export default function CriarMarca() {
  const { marcaId } = useParams();
  const router = useRouter();

  const [toast, setToast] = useState<null | "success" | "error" | "conflict">(
    null
  );

  const showToast = (type: "success" | "error" | "conflict") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const [marca, setMarca] = useState<Fornecedor>();
  const [marcaEditada, setMarcaEditada] = useState<Fornecedor>();
  const [editar, setEditar] = useState(false);
  const [urlImagem, setUrlImagem] = useState("");

  const inative = () => {
    return editar ? false : true;
  };
  const toastMap = {
    success: {
      title: "Marca atualizada com sucesso",
      message: "Você será redirecionado para a lista de marcas.",
      type: "success",
    },
    conflict: {
      title: "Erro ao atualizar marca",
      message: "Marca já existe com esses dados.",
      type: "error",
    },
    error: {
      title: "Erro ao atualizar marca",
      message: "Verifique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const handleCancelar = () => {
    setMarcaEditada(marca);
    setEditar(false);
  };

  useEffect(() => {
    atualizarMarca();
  }, []);

  const atualizarMarca = async () => {
    const marca = await marcaPorId(Number(marcaId));
    if (marca) {
      setMarca(marca);
      setMarcaEditada({ ...marca });
      setUrlImagem(marca.imagemUrl || "");
    }
  };

  const handleMarcaEditada =
    (field: keyof Fornecedor) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setMarcaEditada((prev) =>
        prev ? { ...prev, [field]: e.target.value } : prev
      );
    };

  const handleSalvar = async () => {
    if (!marcaEditada) return;

    try {
      const fornecedorAtualizado = {
        ...marcaEditada,
        imagemUrl: urlImagem,
      };
      
      const response = await atualizarFornecedor(marcaEditada.id, fornecedorAtualizado);
            
      showToast("success");
      
      setTimeout(() => {
        router.push("/estoque/marcas");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          showToast("error");
          return;
        }
        if (status === 409) {
          showToast("conflict");
          return;
        }
      }
      showToast("error");
    }
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen">
      {/* Toast */}
      {toast && <Toast {...toastMap[toast]} />}

      <Header title="Editar" subtitle="Marca" />

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex justify-between">
          <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl bg-white">
            {urlImagem ? (
              <img
                src={urlImagem}
                alt="Pré-visualização da imagem"
                className="rounded w-full h-full object-cover"
              />
            ) : (
              <ImageIcon fontSize="inherit" />
            )}
          </div>

          {/* Botão de arquivo comentado por enquanto */}
          {/* <ButtonFile
            id="imagem-marca"
            onSelect={(file) => console.log(file)}
            label="Adicionar Imagem"
            accept="image/*"
          /> */}
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="marca-name"
            disabled={inative()}
            value={editar ? marcaEditada?.nome ?? "" : marca?.nome ?? ""}
            handleChange={handleMarcaEditada("nome")}
          />
          <Input
            label="Descrição"
            name="marca-description"
            disabled={inative()}
            value={
              editar ? marcaEditada?.descricao ?? "" : marca?.descricao ?? ""
            }
            handleChange={handleMarcaEditada("descricao")}
          />
          <Input
            label="CNPJ"
            name="marca-cnpj"
            disabled={inative()}
            value={editar ? marcaEditada?.cnpj ?? "" : marca?.cnpj ?? ""}
            handleChange={handleMarcaEditada("cnpj")}
          />
          <Input
            label="URL da Imagem"
            name="marca-url-imagem"
            disabled={inative()}
            value={editar ? urlImagem : marca?.imagemUrl ?? ""}
            handleChange={(e) => setUrlImagem(e.target.value)}
          />
        </div>

        {/* Buttons */}
        {editar ? (
          <div className="flex flex-col gap-2">
            <Button label="Confirmar alterações" fullWidth onClick={handleSalvar} />
            <Button
              label="Cancelar"
              fullWidth
              variant="outlined"
              onClick={handleCancelar}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <Button
                label="Editar Marca"
                fullWidth
                onClick={() => setEditar(!editar)}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
