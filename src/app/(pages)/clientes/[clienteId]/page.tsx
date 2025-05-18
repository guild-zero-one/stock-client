"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  buscarClientePorId,
  editarCliente,
  desativarCliente,
} from "@/api/spring/services/ClienteService";

import {
  criarContato,
  editarContato,
} from "@/api/spring/services/ContatoService";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";

import Person from "@mui/icons-material/Person";

export default function DetalheCliente() {
  const { clienteId } = useParams();

  const [cliente, setCliente] = useState({
    nome: "",
    sobrenome: "",
    email: "",
  });

  const [contato, setContato] = useState({
    celular: "",
  });

  useEffect(() => {
    if (!clienteId) return;

    const fetchClientes = async () => {
      try {
        const response: ClienteResponse = await buscarClientePorId(clienteId);

        setCliente({
          nome: response.nome || "",
          sobrenome: response.sobrenome || "",
          email: response.email || "",
        });

        setContato({
          celular: response.contato?.celular || "",
        });
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchClientes();
  }, [clienteId]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clienteResponse = await editarCliente(clienteId, cliente);

      if (!clienteResponse.contato) {
        await criarContato(clienteResponse.id, contato);
      } else {
        await editarContato(clienteResponse.contato.id, contato);
      }

      // Adicionar modal de sucesso
    } catch (error) {
      console.error("Erro criar usuário:", error);
    }
  };

  const handleDesativar = async () => {
    try {
      await desativarCliente(clienteId);
      alert("Cliente desativado com sucesso!");

      setTimeout(() => {
        router.push("/clientes");
      }, 2000);
    } catch (error) {
      console.error("Erro ao desativar cliente:", error);
      alert("Erro ao desativar cliente");
    }
  };

  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      <Header title="Cliente" subtitle="Detalhes" />

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
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-4 w-full">
        <div className="flex gap-2">
          <Input
            label="Nome"
            name="nome"
            inputSize="small"
            handleChange={handleCliente}
            value={cliente.nome}
          />
          <Input
            label="Sobrenome"
            name="sobrenome"
            inputSize="small"
            handleChange={handleCliente}
            value={cliente.sobrenome}
          />
        </div>
        <Input
          label="Telefone"
          name="celular"
          inputSize="small"
          handleChange={handleContato}
          value={contato.celular}
        />
        <Input
          label="E-mail"
          name="email"
          inputSize="small"
          handleChange={handleCliente}
          value={cliente.email}
        />
        <Button
          label="Excluir"
          variant="outlined"
          fullWidth
          onClick={handleDesativar}
        />
        <Button label="Editar" fullWidth />
      </form>
    </div>
  );
}
