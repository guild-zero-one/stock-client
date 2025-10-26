"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { criarCliente } from "@/api/spring/services/ClienteService";
import { aplicarMascaraTelefone, removerMascaraTelefone } from "@/utils/masks";

import axios from "axios";

import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast from "@/components/toast";

import Person from "@mui/icons-material/Person";

export default function AdicionarCliente() {
  const [toast, setToast] = useState<null | "success" | "error" | "conflict">(
    null
  );

  const showToast = (type: "success" | "error" | "conflict") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const [cliente, setCliente] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    celular: "",
    senha: "",
    permissao: "COMUM",
  });

  const handleCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "celular") {
      if (value.length < cliente.celular.length) {
        setCliente(prevCliente => ({
          ...prevCliente,
          [name]: value,
        }));
      } else {
        const valorComMascara = aplicarMascaraTelefone(value);
        setCliente(prevCliente => ({
          ...prevCliente,
          [name]: valorComMascara,
        }));
      }
    } else {
      setCliente(prevCliente => ({
        ...prevCliente,
        [name]: value,
      }));
    }
  };

  const toastMap = {
    success: {
      title: "Cliente adicionado com sucesso",
      message: "Você será redirecionado para a lista de clientes.",
      type: "success",
    },
    conflict: {
      title: "Erro ao criar cliente",
      message: "Cliente já cadastrado.",
      type: "error",
    },
    error: {
      title: "Erro ao criar cliente",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove a máscara antes de enviar para o banco
      const clienteParaEnvio = {
        ...cliente,
        celular: removerMascaraTelefone(cliente.celular),
      };

      const clienteResponse = await criarCliente(clienteParaEnvio);

      showToast("success");

      setTimeout(() => {
        router.push("/clientes");
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
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      {/* Toast */}
      {toast && <Toast {...toastMap[toast]} />}

      <Header backRouter="/clientes" title="Cliente" subtitle="Adicionar" />

      {/* Icone e nome do cliente */}
      <div className="flex justify-between gap-4 p-4 w-full">
        <div className="flex items-center bg-pink-default p-4 rounded-lg">
          <Person fontSize="large" className="text-white" />
        </div>

        <div className="flex items-end flex-col gap-2 ">
          <p className="text-sm font-bold">Adicionar Cliente</p>
          <p className="text-xs text-text-secondary">
            Adicione um novo cliente para começar a usar o sistema.
          </p>
        </div>
      </div>

      {/* Adicionar Cliente */}
      <form onSubmit={handleCreate} className="flex flex-col gap-4 p-4 w-full">
        <Input
          label="Nome"
          name="nome"
          size="small"
          handleChange={handleCliente}
        />
        <Input
          label="Sobrenome"
          name="sobrenome"
          size="small"
          handleChange={handleCliente}
        />
        <Input
          label="Celular"
          name="celular"
          size="small"
          value={cliente.celular}
          handleChange={handleCliente}
          maxLength={15}
        />
        <Input
          label="E-mail"
          name="email"
          size="small"
          handleChange={handleCliente}
        />
        <Button type="submit" label="Adicionar" variant="outlined" fullWidth />
      </form>
    </div>
  );
}
