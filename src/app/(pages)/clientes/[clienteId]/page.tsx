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
import { aplicarMascaraTelefone, removerMascaraTelefone } from "@/utils/masks";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast from "@/components/toast";

import Person from "@mui/icons-material/Person";
import Modal from "@/components/modal-popup";
import { PersonRemoveOutlined } from "@mui/icons-material";

export default function DetalheCliente() {
  const [toast, setToast] = useState<null | "success" | "error">(null);
  const [modalAberto, setModalAberto] = useState(false);

  const { clienteId } = useParams();
  const id = Array.isArray(clienteId) ? clienteId[0] : clienteId;
  const router = useRouter();

  const showToast = (type: "success" | "error") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const [cliente, setCliente] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    permissao: "COMUM",
  });

  const [contato, setContato] = useState({
    celular: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchClientes = async () => {
      try {
        const response: ClienteResponse = await buscarClientePorId(id);

        setCliente({
          nome: response.nome || "",
          sobrenome: response.sobrenome || "",
          email: response.email || "",
          permissao: response.permissao || "COMUM",
        });

        setContato({
          celular: response.contato?.celular || "",
        });
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        showToast("error");
      }
    };

    fetchClientes();
  }, [id]);

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
      title: "Cliente atualizado com sucesso",
      message: "Você será redirecionado para a lista de clientes.",
      type: "success",
    },
    error: {
      title: "Erro ao atualizar cliente",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      showToast("error");
      return;
    }

    try {
      await editarCliente(id, cliente);

      const clienteAtualizado = await buscarClientePorId(id);

      const contatoSemMascara = {
        celular: removerMascaraTelefone(contato.celular),
      };

      if (!clienteAtualizado.contato) {
        await criarContato(clienteAtualizado.id, contatoSemMascara);
      } else {
        await editarContato(clienteAtualizado.contato.id, contatoSemMascara);
      }

      showToast("success");

      setTimeout(() => {
        router.push("/clientes");
      }, 3000);
    } catch (error) {
      console.error("Erro na atualização:", error);
      showToast("error");
    }
  };

  const handleDesativar = async () => {
    if (!id) return;

    try {
      setModalAberto(false);
      await desativarCliente(id);
      showToast("success");

      setTimeout(() => {
        router.push("/clientes");
      }, 3000);
    } catch (error) {
      console.error("Erro ao desativar:", error);
      showToast("error");
    }
  };

  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      {/* Toast */}
      {toast && <Toast {...toastMap[toast]} />}

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

      <Modal
        open={modalAberto}
        icon={<PersonRemoveOutlined fontSize="inherit" />}
        onClose={() => {
          setModalAberto(false);
        }}
        title={<p>Desativar Cliente</p>}
        body={
          <div className="flex flex-col gap-4">
            <span className="flex flex-col gap-1">
              <p className=" text-center">Deseja desativar este cliente?</p>
              <p className="text-pink-default font-bold">
                Essa ação é irreversível e não poderá ser desfeita.
              </p>
            </span>

            <span className="flex flex-col gap-2">
              <Button
                label="Cancelar"
                variant="outlined"
                fullWidth
                onClick={() => setModalAberto(false)}
              />
              <Button
                label="Desativar Cliente"
                fullWidth
                onClick={handleDesativar}
              />
            </span>
          </div>
        }
      />

      {/* Adicionar Cliente */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-4 w-full">
        <div className="flex gap-2">
          <Input
            label="Nome"
            name="nome"
            size="small"
            handleChange={handleCliente}
            value={cliente.nome}
          />
          <Input
            label="Sobrenome"
            name="sobrenome"
            size="small"
            handleChange={handleCliente}
            value={cliente.sobrenome}
          />
        </div>
        <Input
          label="Telefone"
          name="celular"
          size="small"
          handleChange={handleContato}
          value={contato.celular}
          maxLength={15}
        />
        <Input
          label="E-mail"
          name="email"
          size="small"
          handleChange={handleCliente}
          value={cliente.email}
        />
        <Button
          label="Excluir"
          variant="outlined"
          fullWidth
          onClick={() => setModalAberto(true)}
        />
        <Button type="submit" label="Editar" fullWidth />
      </form>
    </div>
  );
}
