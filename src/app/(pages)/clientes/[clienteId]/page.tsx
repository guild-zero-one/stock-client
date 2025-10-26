"use client";

import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  buscarClientePorId,
  editarCliente,
  desativarCliente,
  ativarCliente,
} from "@/api/spring/services/ClienteService";

import { aplicarMascaraTelefone, removerMascaraTelefone } from "@/utils/masks";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";

import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast from "@/components/toast";

import Person from "@mui/icons-material/Person";
import Modal from "@/components/modal-popup";
import { PersonRemoveOutlined, PersonAddOutlined } from "@mui/icons-material";

export default function DetalheCliente() {
  const [toast, setToast] = useState<null | "success" | "error">(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteAtivo, setClienteAtivo] = useState(true);

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
    celular: "",
    permissao: "COMUM",
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
          celular: response.celular
            ? aplicarMascaraTelefone(response.celular)
            : "",
          permissao: response.permissao || "COMUM",
        });

        setClienteAtivo(response.ativo ?? true);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        showToast("error");
      }
    };

    fetchClientes();
  }, [id]);

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
      // Remove a máscara antes de enviar para o banco
      const clienteParaEnvio = {
        ...cliente,
        celular: removerMascaraTelefone(cliente.celular),
      };

      await editarCliente(id, clienteParaEnvio);

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
      setClienteAtivo(false);
      showToast("success");

      setTimeout(() => {
        router.push("/clientes");
      }, 3000);
    } catch (error) {
      console.error("Erro ao desativar:", error);
      showToast("error");
    }
  };

  const handleAtivar = async () => {
    if (!id) return;

    try {
      await ativarCliente(id);
      setClienteAtivo(true);
      showToast("success");

      setTimeout(() => {
        router.push("/clientes");
      }, 3000);
    } catch (error) {
      console.error("Erro ao ativar:", error);
      showToast("error");
    }
  };

  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      {/* Toast */}
      {toast && <Toast {...toastMap[toast]} />}

      <Header backRouter="/clientes" title="Cliente" subtitle="Detalhes" />

      {/* Icone e nome do cliente */}
      <div className="flex justify-between gap-4 p-4 w-full">
        <div className="flex items-center bg-pink-default p-4 rounded-lg">
          <Person fontSize="large" className="text-white" />
        </div>

        <div className="flex items-end flex-col gap-2 ">
          <p className="text-sm font-bold">Editar Cliente</p>
          <p className="text-xs text-text-secondary">
            {`${cliente.nome} ${cliente.sobrenome}`}
          </p>
        </div>
      </div>

      <Modal
        open={modalAberto}
        icon={
          clienteAtivo ? (
            <PersonRemoveOutlined fontSize="inherit" />
          ) : (
            <PersonAddOutlined fontSize="inherit" />
          )
        }
        onClose={() => {
          setModalAberto(false);
        }}
        title={<p>{clienteAtivo ? "Desativar Cliente" : "Ativar Cliente"}</p>}
        body={
          <div className="flex flex-col gap-4">
            <span className="flex flex-col gap-1 text-center">
              <p>
                {clienteAtivo
                  ? "Deseja desativar este cliente?"
                  : "Deseja ativar este cliente?"}
              </p>
              {clienteAtivo && (
                <p className="text-pink-default font-bold">
                  Essa ação é irreversível e não poderá ser desfeita.
                </p>
              )}
            </span>

            <span className="flex flex-col gap-2">
              <Button
                label="Cancelar"
                variant="outlined"
                fullWidth
                onClick={() => setModalAberto(false)}
              />
              <Button
                label={clienteAtivo ? "Desativar Cliente" : "Ativar Cliente"}
                fullWidth
                onClick={clienteAtivo ? handleDesativar : handleAtivar}
              />
            </span>
          </div>
        }
      />

      {/* Adicionar Cliente */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 p-4 w-full">
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
        <Input
          label="Celular"
          name="celular"
          size="small"
          handleChange={handleCliente}
          value={cliente.celular}
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
          label={clienteAtivo ? "Desativar" : "Ativar"}
          variant="outlined"
          fullWidth
          onClick={() => setModalAberto(true)}
        />
        <Button type="submit" label="Editar" fullWidth />
      </form>
    </div>
  );
}
