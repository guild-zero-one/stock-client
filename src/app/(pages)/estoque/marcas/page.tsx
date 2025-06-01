"use client";

import { useEffect, useState } from "react";

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { todasMarcas } from "@/api/spring/services/FornecedorService";

import Link from "next/link";

import Header from "@/components/header";
import Input from "@/components/input";
import MenuBrand from "@/components/menu-brand";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";

export default function Estoque() {

    const [inputPesquisar, setInputPesquisar] = useState("");
    const [marcas, setMarcas] = useState<Fornecedor[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputPesquisar(value);
    };

    useEffect(() => {
        const fetchMarcas = async () => {
            const marcas = await todasMarcas();
            if (marcas) {
                setMarcas(marcas);
            }
        };

        fetchMarcas();
    }, []);

    const marcasFiltradas = marcas.filter((marca) =>
        marca
            .nome
            .toLowerCase()
            .includes(inputPesquisar
                .toLowerCase()
                .trim()));

    return (
        <div className="relative flex flex-col w-full min-h-screen">
            <Header title="Estoque" subtitle="Marca">
                <DropdownAdd>
                    <Link href={"./marcas/criar"}>
                        <DropdownItem text="Adicionar Marca" icon={<AddCircle />} />
                    </Link>
                </DropdownAdd>
            </Header>

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <Input name="search" label="Pesquisar" type="text" iconSymbol={<SearchIcon />} handleChange={handleSearchChange} />
            </div>

            <div className="bottom-0 absolute flex flex-col bg-pink-secondary p-4 pb-0 rounded-t-2xl w-full h-[80%] max-h-[85%]">
                <div className="flex flex-col justify-center items-center my-1 w-full">
                    <span className="font-bold text-pink-secondary-dark text-sm">Marcas</span>
                </div>
                <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto scrollbar-minimal">
                    {inputPesquisar.length === 0 ? (
                        marcas.map((marca) => (
                            <Link key={marca.id} href={`./marcas/${marca.id}/produtos`}>
                                <MenuBrand name={marca.nome} image={marca.imagemUrl} description={marca.descricao} />
                            </Link>
                        ))
                    ) : marcasFiltradas.length > 0 ? (
                        marcasFiltradas.map((marca) => <MenuBrand key={marca.id} name={marca.nome} image={marca.imagemUrl} description={marca.descricao} />)
                    ) : (
                        <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
                            <h2 className="italic">Nenhuma marca encontrada</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
