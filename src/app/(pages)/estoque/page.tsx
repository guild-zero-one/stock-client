'use client'
import Header from "@/components/header";
import Input from "@/components/input";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { Categoria } from "@/models/Categoria";
import CategoriesMenu from "@/components/categories-menu";
import { todasCategorias } from "@/api/spring/services/CategoriaService";

export default function Estoque() {

    const [inputPesquisar, setInputPesquisar] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputPesquisar(value);
    }
    useEffect(() => {
        const fetchCategories = async () => {
            const categorias = await todasCategorias();
            setCategorias(categorias);
        };

        fetchCategories();
    }, []);

    const categoriasFiltradas = categorias.filter(categoria =>
        categoria.name
            .toLowerCase()
            .includes(inputPesquisar
                .toLowerCase()
                .trim())
    );

    return (
        <div className="relative flex flex-col bg-white-default w-full min-h-screen">
            <Header
                title="Estoque"
                subtitle="Categorias"
                addRightButton={true}
                rightIcon={<AddCircleIcon />}
            />

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

            <div className="bottom-0 absolute flex flex-col bg-pink-secondary p-4 pb-0 rounded-t-2xl w-full h-[80%] max-h-[85%]">
                <div className="flex flex-col justify-center items-center my-1 w-full">
                    <span className="font-bold text-pink-secondary-dark text-sm">Categorias</span>
                </div>
                <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto scrollbar-minimal">

                    {inputPesquisar.length === 0 ? (
                        categorias.map((categoria) => (
                            <CategoriesMenu
                                key={categoria.id}
                                name={categoria.name}
                                image={categoria.image}
                                description={categoria.description}
                                quantity={categoria.quantity}
                                onClick={() => {
                                    alert(`Categoria: ${categoria.name}`);
                                }}
                            />
                        ))
                    ) : categoriasFiltradas.length > 0 ? (
                        categoriasFiltradas.map((categoria) => (
                            <CategoriesMenu
                                key={categoria.id}
                                name={categoria.name}
                                image={categoria.image}
                                description={categoria.description}
                                quantity={categoria.quantity}
                                onClick={() => {
                                    alert(`Categoria: ${categoria.name}`);
                                }}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
                            <h2 className="text-2xl">Nenhuma categoria encontrada :( </h2>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}

