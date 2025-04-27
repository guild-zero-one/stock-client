'use client'
import Header from "@/components/header";
import Input from "@/components/input";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { Marca } from "@/models/Marca";
import CategoriesMenu from "@/components/categories-menu";
import { todasMarcas } from "@/api/spring/services/MarcaService";
import Link from "next/link";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";
import AddCircle from "@mui/icons-material/AddCircle";

export default function Estoque() {

    const [inputPesquisar, setInputPesquisar] = useState("");
    const [marcas, setMarcas] = useState<Marca[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputPesquisar(value);
    }
    useEffect(() => {
        const fetchMarcas = async () => {
            const marcas = await todasMarcas();
            setMarcas(marcas);
        };

        fetchMarcas();
    }, []);

    const marcasFiltradas = marcas.filter(marca =>
        marca.name
            .toLowerCase()
            .includes(inputPesquisar
                .toLowerCase()
                .trim())
    );

    return (
        <div className="relative flex flex-col bg-white-default w-full min-h-screen">

            <Header title="Estoque" subtitle="Marca">

                <DropdownAdd>

                    <Link href={"#"}>
                        <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
                    </Link>

                </DropdownAdd>

            </Header>

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <Input
                    name="search"
                    label="Pesquisar"
                    type="text"
                    showIcon
                    iconSymbol={<SearchIcon />}
                    inputSize="small"
                    handleChange={handleSearchChange}
                />
            </div>
        </div>
    );
}

