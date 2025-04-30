"use client";

import { authMiddleware } from "@/middlewares/auth";

import MenuLink from "@/components/menu-link";

import Link from "next/link";
import Image from "next/image";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from "react";
import { Usuario } from "@/models/Usuario";
import { listarUsuarios } from "@/api/spring/services/UsuarioService";

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  authMiddleware();

  useEffect(() => {
    const fetchData = async () => {
      const emailArmazenado = localStorage.getItem("email");
      if (!emailArmazenado) return;

      try {
        const listaUsuarios = await listarUsuarios();
        if (listaUsuarios) {
          setUsuarios(listaUsuarios);

          const usuarioEncontrado = listaUsuarios.find(
            (u: Usuario) => u.email === emailArmazenado
          );

          if (usuarioEncontrado) {
            setUsuario(usuarioEncontrado);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-dvh">
      {/* Banner */}
      <header className="relative h-[45vh] text-white">
        {/* Imagem de fundo */}
        <Image className="z-0 object-center object-cover" src="/assets/images/people.jpg" alt="Pessoas" fill priority />

        {/* Filtro de cor */}
        <div className="absolute inset-0 bg-pink-default/65" />

        {/* Conteúdo */}
        <div className="z-10 relative flex justify-between items-center p-4">
          <h1 className="font-bold text-2xl">Boas vindas {usuario?.nome}</h1>
          <Link href={"/usuario"}>
            <div className="group flex justify-center items-center bg-pink-default rounded-full w-8 h-8 text-gray-default text-2xl">
                <AccountCircleIcon className="group-hover:scale-125" fontSize="inherit" />
            </div>
          </Link>
        </div>
      </header>

      {/* Painel de Navegação */}
      <main className="z-10 relative flex bg-white-default -mt-5 p-4 rounded-t-3xl w-full h-full overflow-hidden grow">
        {/* Grid */}
        <div className="gap-2 grid grid-cols-2 w-full h-fit">
          {/* Dashboard View */}
          <div className="flex flex-col justify-center items-start col-span-2 bg-gray-default p-4 rounded-xl w-full h-[10vh] min-h-[120px] max-h-[300px]">
            <span className="text-text-secondary text-sm">Total em $ de vendas este mês</span>
            <span className="font-bold text-text-default text-3xl">R$ 0,00</span>
          </div>

          {/* Clientes */}
          <div className="h-fit">
            <Link href={"/clientes"}>
              <MenuLink label="Clientes" icon={<PeopleAltOutlinedIcon />} />
            </Link>
          </div>

          {/* Estoque */}
          <div className="h-fit">
            <Link href={"/estoque/marcas/"}>
              <MenuLink label="Estoque" icon={<Inventory2OutlinedIcon />} />
            </Link>
          </div>

          {/* Pedidos */}
          <div className="h-fit">
            <Link href={"/pedidos"}>
              <MenuLink label="Pedidos" icon={<ShoppingBagOutlinedIcon />} />
            </Link>
          </div>

          {/* Relatório */}
          <div className="h-fit">
            <Link href={"/relatorio"}>
              <MenuLink label="Relatório" icon={<InsertChartOutlinedIcon />} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
