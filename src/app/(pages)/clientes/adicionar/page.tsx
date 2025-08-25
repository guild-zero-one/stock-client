"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { criarCliente } from "@/api/spring/services/ClienteService";
import { criarContato } from "@/api/spring/services/ContatoService";
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
    senha: "12345678",
    permissao: "COMUM",
  });

  const [contato, setContato] = useState({
    celular: "",
  });

  const handleCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente(prevCliente => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleContato = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "celular") {
      if (value.length < contato.celular.length) {
        setContato(prevContato => ({
          ...prevContato,
          [name]: value,
        }));
      } else {
        const valorComMascara = aplicarMascaraTelefone(value);
        setContato(prevContato => ({
          ...prevContato,
          [name]: valorComMascara,
        }));
      }
    } else {
      setContato(prevContato => ({
        ...prevContato,
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
      const clienteResponse = await criarCliente(cliente);

      if (contato.celular.trim().length > 0) {
        // Remove a máscara antes de enviar para o banco
        const contatoSemMascara = {
          celular: removerMascaraTelefone(contato.celular),
        };
        await criarContato(clienteResponse.id, contatoSemMascara);
      }

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
            size="small"
            handleChange={handleCliente}
          />
          <Input
            label="Sobrenome"
            name="sobrenome"
            size="small"
            handleChange={handleCliente}
          />
        </div>
        <Input
          label="Celular"
          name="celular"
          size="small"
          value={contato.celular}
          handleChange={handleContato}
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
