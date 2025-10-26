"use client";

import Header from "@/components/header";
import type { Usuario } from "@/models/Usuario/Usuario";
import { useEffect, useState } from "react";
import {
  editarUsuario,
  loggout,
  usuarioAutenticado,
} from "@/api/spring/services/UsuarioService";
import { aplicarMascaraTelefone, removerMascaraTelefone } from "@/utils/masks";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import BadgeIcon from "@mui/icons-material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Usuario() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [usuarioEditado, setUsuarioEditado] = useState<Usuario>();
  const [editar, setEditar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        atualizarUsuario();
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchData();
  }, []);

  const atualizarUsuario = async () => {
    const usuario = await usuarioAutenticado();
    if (usuario) {
      // Aplica máscara no celular quando os dados chegam do backend
      const usuarioComMascara = {
        ...usuario,
        celular: usuario.celular ? aplicarMascaraTelefone(usuario.celular) : "",
      };
      setUsuario(usuarioComMascara);
      setUsuarioEditado({ ...usuarioComMascara });
    }
  };
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      await loggout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      router.push("/login");
    }
  };

  const inative = () => {
    return editar ? false : true;
  };

  const handleEditar = async () => {
    if (!usuario || !usuarioEditado) return;

    // Remove a máscara antes de enviar para o backend
    const usuarioParaEnvio = {
      ...usuarioEditado,
      celular: removerMascaraTelefone(usuarioEditado.celular),
    };

    await editarUsuario(usuario.id, usuarioParaEnvio);
    atualizarUsuario();
    setEditar(!editar);
  };

  const handleCancelar = () => {
    setUsuarioEditado(usuario);
    setEditar(false);
  };

  const handleUsuarioEditado =
    (field: keyof Usuario) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (field === "celular") {
        if (value.length < (usuarioEditado?.celular?.length || 0)) {
          setUsuarioEditado(prev =>
            prev ? { ...prev, [field]: value } : prev
          );
        } else {
          const valorComMascara = aplicarMascaraTelefone(value);
          setUsuarioEditado(prev =>
            prev ? { ...prev, [field]: valorComMascara } : prev
          );
        }
      } else {
        setUsuarioEditado(prev => (prev ? { ...prev, [field]: value } : prev));
      }
    };

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <div className="bg-pink-default w-full h-[30vh]">
        <Header
          title="Meu Perfil"
          subtitle="Configurações"
          variant="secondary"
        ></Header>
      </div>

      <form className="relative flex flex-col bg-white-default -mt-4 p-4 rounded-t-2xl w-full h-full grow">
        <div className="flex flex-col gap-2">
          <Input
            label="Nome"
            name="name"
            iconSymbol={<PersonIcon />}
            value={editar ? usuarioEditado?.nome ?? "" : usuario?.nome ?? ""}
            disabled={inative()}
            handleChange={handleUsuarioEditado("nome")}
          />
          <Input
            label="Sobrenome"
            name="sobrenome"
            iconSymbol={<BadgeIcon />}
            value={
              editar
                ? usuarioEditado?.sobrenome ?? ""
                : usuario?.sobrenome ?? ""
            }
            disabled={inative()}
            handleChange={handleUsuarioEditado("sobrenome")}
          />
          <Input
            label="Email"
            name="email"
            iconSymbol={<MailIcon />}
            value={editar ? usuarioEditado?.email ?? "" : usuario?.email ?? ""}
            disabled={inative()}
            handleChange={handleUsuarioEditado("email")}
          />
          <Input
            label="Celular"
            name="celular"
            iconSymbol={<PhoneIcon />}
            value={
              editar ? usuarioEditado?.celular ?? "" : usuario?.celular ?? ""
            }
            disabled={inative()}
            handleChange={handleUsuarioEditado("celular")}
            maxLength={15}
          />
        </div>

        <footer className="flex flex-col gap-2 mt-auto w-full">
          {editar ? (
            <div className="flex flex-col gap-2">
              <Button
                label="Confirmar alterações"
                onClick={() => handleEditar()}
                fullWidth
              />
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
                  label="Editar perfil"
                  fullWidth
                  onClick={() => setEditar(!editar)}
                />
                <Button label="Alterar Senha" fullWidth variant="outlined" />
                <Button
                  label="Encerrar Sessão"
                  fullWidth
                  variant="outlined"
                  onClick={handleLogout}
                />
              </div>
            </>
          )}
        </footer>
      </form>
    </div>
  );
}
