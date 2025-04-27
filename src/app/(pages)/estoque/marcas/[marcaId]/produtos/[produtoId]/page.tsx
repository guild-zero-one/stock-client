
'use client'
import { marcaPorId } from "@/api/spring/services/MarcaService";
import { produtoPorId } from "@/api/spring/services/ProdutoService";
import Header from "@/components/header";
import { Marca } from "@/models/Marca";
import { Produto } from "@/models/Produto";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProdutoPage = () => {
    const { marcaId } = useParams();
    const { produtoId } = useParams()

    const [marca, setMarca] = useState<Marca>();
    const [produto, setProduto] = useState<Produto>()

    useEffect(() => {
        const fetchData = async () => {
            const marca = await marcaPorId(Number(marcaId))
            if (marca) {
                setMarca(marca)
            }
            const produto = await produtoPorId(Number(produtoId))
            if (produto) {
                setProduto(produto)
            }
        }
        fetchData()
    }, []) // tinha esquecido de colocar isso []
    return (
        <div className="w-full">
            {produto && marca && (
                <Header title="Detalhes" subtitle={produto.name} />
            )}

            {/* Grid */}
            <div className="grid mx-auto px-4">
                <img src={produto?.image} alt="" className="w-full object-contain" />

                {/* Card */}
                <div className="flex bg-white p-4 border border-gray-dark rounded-xl">

                    {/* Text */}
                    <div className="flex justify-between items-center w-full h-fit">
                        <div className="flex flex-col">
                            <span className="text-text-secondary text-xs/1">{marca?.name}</span>
                            <h2 className="font-lexend text-base">{produto?.name}</h2>
                        </div>
                        <div>
                            <span className="font-lexend">R$ {produto?.price},00</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default ProdutoPage;