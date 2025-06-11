"use client";

import { useState } from "react";

import { criarFornecedor } from "@/api/spring/services/FornecedorService";

import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import ImageIcon from "@mui/icons-material/Image";

export default function CriarMarca() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);

  const criarMarca = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const fornecedor = {
        nome,
        descricao,
        cnpj,
      };

      const response = await criarFornecedor(fornecedor);

      if (imagem) {
        console.log("Imagem selecionada:", imagem);
      }

      setNome("");
      setDescricao("");
      setCnpj("");
      setImagem(null);
    } catch (error) {
      console.error("Erro ao criar marca:", error);
    }
  };

  return (
    <main className="relative flex flex-col w-full min-h-screen">
      <Header title="Adicionar" subtitle="Marca" />

      {/* Grid */}
      <form
        onSubmit={criarMarca}
        className="flex flex-col gap-4 p-4 w-full"
        autoComplete="off"
      >
        <div className="flex justify-between">
          <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl bg-white">
            {imagem ? (
              <img
                src={URL.createObjectURL(imagem)}
                alt="Pré-visualização da imagem"
                className="rounded w-full h-full object-cover"
              />
            ) : (
              <ImageIcon fontSize="inherit" />
            )}
          </div>

          <ButtonFile
            id="imagem-marca"
            onSelect={setImagem}
            label="Adicionar Imagem"
            accept="image/*"
          />
        </div>
        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="marca-name"
            handleChange={(e) => setNome(e.target.value)}
            value={nome}
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
    </main>
  );
}
