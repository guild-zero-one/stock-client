'use client'
import React, { useEffect, useState } from 'react';
import { marcaPorId } from '@/api/spring/services/MarcaService';
import { Marca } from '@/models/Marca';
import Header from '@/components/header';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Input from '@/components/input';
import { useParams } from 'next/navigation'
import ProductsList from '@/components/products-list';
import { Produto } from '@/models/Produto';

const ProdutosPage = () => {

    const { marcaId } = useParams();
    const [marca, setMarca] = useState<Marca>();
    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        const fetchMarca = async () => {
            const marca = await marcaPorId(Number(marcaId))
            if (marca) {
                setProdutos(marca.products);
                setMarca(marca);
            }
        }
        fetchMarca()
    }, [])

    useEffect(() => {
        console.log(produtos);
    }, [produtos]);

    return (
        <div className="flex flex-col w-full min-h-dvh">
            <Header
                title="Estoque"
                subtitle={marca?.name ?? 'Carregando...'}
                addRightButton
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
                />
            </div>
            
            {marca && (
                <div className="gap-4 grid grid-cols-1 px-4">
                    <ProductsList produtos={produtos} marca={marca} />
                </div>
            )}
        </div>
    );
};

export default ProdutosPage;

