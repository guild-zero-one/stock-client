"use client";

import Header from "@/components/header";
import type { Usuario } from "@/models/Usuario/Usuario";
import { useEffect, useState } from "react";
import { listarUsuarios, usuarioAutenticado } from "@/api/spring/services/UsuarioService";
import PersonIcon from '@mui/icons-material/Person';
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import Input from "@/components/input";

export default function Usuario() {
    const [usuario, setUsuario] = useState<Usuario>();
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuario = await usuarioAutenticado();
                if (usuario) {
                    setUsuario(usuario);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }

        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        router.push("/login");

        //Preciso de uma rota no backend que crie um jwt com 0 segs
        // "usuarios/logout"
    };

    return (
        <div className="flex flex-col w-full min-h-dvh">
            <div className="bg-pink-default w-full h-[30vh]">
                <Header title="Meu Perfil" subtitle="Configurações" variant="secondary"></Header>
            </div>

            <form className="relative flex flex-col bg-white-default -mt-4 p-4 rounded-t-2xl w-full h-full grow">
                {/* <div className="bottom-[100%] left-1/2 absolute flex justify-center items-center bg-gray-default rounded-full w-50 h-50 text-gray-m-dark text-8xl -translate-x-1/2 translate-y-1/2">
                    <PersonIcon fontSize="inherit" />
                </div> */}

                <main className="w-full h-full grow">
                    <Input label="Nome" name="name" iconSymbol={<PersonIcon/>} value={usuario?.nome ?? ""}/>
                    <Input label="Apelido" name="name" iconSymbol={<PersonIcon/>} value={usuario?.apelido ?? ""}/>
                    <Input label="Email" name="name" iconSymbol={<PersonIcon/>} value={usuario?.email ?? ""}/>
                    <Input label="CPF" name="name" iconSymbol={<PersonIcon/>} value={usuario?.cpf ?? ""}/>
                    {/* <Input label="Nome" name="name" iconSymbol={<PersonIcon/>} value={usuario?.senha ?? ""}/> */}
                </main>

                <footer className="flex flex-col gap-2 mt-auto w-full">
                    <div><Button label="Editar perfil" fullWidth /></div>
                    <div><Button label="Encerrar Sessão" fullWidth variant="outlined" onClick={handleLogout} /></div>
                    <div><Button label="Alterar Senha" fullWidth variant="outlined" onClick={handleLogout} /></div>
                </footer>
            </form>
        </div>
    )
}