
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
    })
    return (
        <div>
            {produto && marca && (
                <Header title="Detalhes" subtitle={produto.name}/>
            )}
        </div>
    )
}
export default ProdutoPage;