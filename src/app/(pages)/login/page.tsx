"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/api/spring/services/UsuarioService";

import Image from "next/image";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast from "@/components/toast";

export default function Home() {
  const [user, setUser] = useState({
    email: "",
    senha: "",
  });

  const [toast, setToast] = useState<null | "success" | "error">(null);
  const showToast = (type: "success" | "error") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const toastMap = {
    success: {
      title: "Login realizado com sucesso",
      message: "Você será redirecionado para página principal.",
      type: "success",
    },
    error: {
      title: "Erro ao realizar login",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  const router = useRouter();

  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(user);
      const response = await login(user);

      localStorage.setItem("token", response.token);
      localStorage.setItem("email", response.email);

      showToast("success");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      showToast("error");
    }
  };

  return (
    <div className="flex flex-col w-full h-dvh">
      {toast && <Toast {...toastMap[toast]} />}

      {/* Banner */}
      <header className="relative h-[100vh] text-white">
        {/* Imagem de fundo */}
        <Image
          className="z-0 object-center object-cover"
          src="/assets/images/people.jpg"
          alt="Pessoas"
          fill
          priority
        />

        {/* Filtro de cor */}
        <div className="absolute inset-0 bg-pink-default/65" />

        {/* Conteúdo */}
        <div className="z-10 relative p-4">
          <h1 className="font-bold text-2xl">Boas-vindas</h1>
        </div>
      </header>

      {/* Painel de Navegação */}
      <main className="z-10 relative flex bg-white-default -mt-5 p-4 rounded-t-3xl w-full h-full overflow-hidden grow">
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-between gap-4 w-full"
        >
          <h2 className="font-lexend font-semibold text-pink-default text-4xl text-center">
            SimLady
          </h2>

          <p className="text-center">Faça seu login para continuar</p>

          <Input
            label="E-mail"
            name="email"
            size="small"
            handleChange={handleUser}
          />
          <Input
            label="Senha"
            name="senha"
            size="small"
            handleChange={handleUser}
            type="password"
          />
          <Button label="Entrar" fullWidth type="submit" />

          <p className="text-center">Esqueci minha senha</p>
        </form>
      </main>
    </div>
  );
}
