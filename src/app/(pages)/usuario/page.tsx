"use client";

import Header from "@/components/header";
import type { Usuario } from "@/models/Usuario/Usuario";
import { useEffect, useState } from "react";
import { listarUsuarios } from "@/api/spring/services/UsuarioService";
import PersonIcon from '@mui/icons-material/Person';
import Button from "@/components/button";
import { useRouter } from "next/navigation";

export default function Usuario() {
    const [usuario, setUsuario] = useState<Usuario>();
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const router = useRouter();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        router.push("/login");
    };

    return (
        <div className="flex flex-col w-full min-h-dvh">
            <div className="bg-pink-default w-full h-[30vh]">
                <Header title="Meu Perfil" subtitle="Configurações" variant="secondary"></Header>
            </div>

            <div className="relative bg-white-default -mt-4 rounded-t-2xl grow">
                <div className="bottom-[100%] left-1/2 absolute flex justify-center items-center bg-gray-default rounded-full w-50 h-50 text-gray-m-dark text-8xl -translate-x-1/2 translate-y-1/2">
                    <PersonIcon fontSize="inherit" />
                </div>

                <footer className="bottom-0 absolute flex flex-col gap-2 p-4 w-full">
                    <div><Button label="Editar perfil" fullWidth /></div>
                    <div><Button label="Encerrar Sessão" fullWidth variant="outlined" onClick={handleLogout} /></div>
                </footer>
            </div>
        </div>
    )
}