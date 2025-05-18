"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { criarCliente } from "@/api/spring/services/ClienteService";
import { criarContato } from "@/api/spring/services/ContatoService";

import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";

import Person from "@mui/icons-material/Person";

export default function AdicionarCliente() {
  const [cliente, setCliente] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "12345678",
    permissao: "COMUM",
  });

  const [contato, setContato] = useState({
    celular: "",
  });

  const handleCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleContato = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContato((prevContato) => ({
      ...prevContato,
      [name]: value,
    }));
  };

  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clienteResponse = await criarCliente(cliente);
      const contatoResponse = await criarContato(clienteResponse.id, contato);

      // Adicionar modal de sucesso
      console.log(
        "Cliente criado com sucesso:",
        clienteResponse,
        contatoResponse
      );
      setTimeout(() => {
        router.push("/clientes");
      }, 2000);
    } catch (error) {
      console.error("Erro criar usuário:", error);
    }
  };

  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      <Header title="Cliente" subtitle="Adicionar" />

      {/* Adicionar Imagem */}
      <div className="flex justify-between gap-4 p-4 w-full">
        <div className="flex items-center bg-pink-default p-4 rounded-lg">
          <Person fontSize="large" className="text-white" />
        </div>

        <div className="flex items-center flex-col gap-2">
          <Button label="Adicionar Imagem" />
          <p className="text-xs text-text-secondary">
            Nenhuma imagem selecionada
          </p>
        </div>
      </div>

      {/* Adicionar Cliente */}
      <form onSubmit={handleCreate} className="flex flex-col gap-4 p-4 w-full">
        <div className="flex gap-2">
          <Input
            label="Nome"
            name="nome"
            inputSize="small"
            handleChange={handleCliente}
          />
          <Input
            label="Sobrenome"
            name="sobrenome"
            inputSize="small"
            handleChange={handleCliente}
          />
        </div>
        <Input
          label="Telefone"
          name="celular"
          inputSize="small"
          handleChange={handleContato}
        />
        <Input
          label="E-mail"
          name="email"
          inputSize="small"
          handleChange={handleCliente}
        />
        <Button label="Adicionar" variant="outlined" fullWidth />
      </form>
    </div>
  );
}
