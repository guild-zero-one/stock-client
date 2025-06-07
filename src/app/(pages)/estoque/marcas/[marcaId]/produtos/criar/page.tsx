'use client'
import { todasMarcas } from "@/api/spring/services/FornecedorService";
import { cadastrarProduto } from "@/api/spring/services/ProdutoService";
import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import Select from "@/components/select";
import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { Produto, ProdutoCreate } from "@/models/Produto/Produto";
import { formatarProduto } from "@/utils/produtoFormatter";
import ImageIcon from '@mui/icons-material/Image';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResumoProdutos from "./adicionarProdutos";

export default function CriarProduto() {

    const [newProduto, setNewProduto] = useState<Partial<ProdutoCreate>>({});
    const [produtos, setProdutos] = useState<ProdutoCreate[]>([]);
    const [marcas, setMarcas] = useState<Fornecedor[]>([])
    const { marcaId } = useParams();
    const [showProdList, setShowProdList] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const marcas = await todasMarcas()
            if (marcas) {
                setMarcas(marcas)
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        const id = parseInt(marcaId as string);
        if (!isNaN(id)) {
            setNewProduto((prev) => ({
                ...prev,
                fornecedorId: id,
            }));
        }
    }, [marcaId]);



    const handleSelectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewProduto((prev) => ({
            ...prev,
            fornecedorId: parseInt(e.target.value),
        }));
    };


    const adicionarProdutoNaLista = () => {
        try {
            const produto = formatarProduto(newProduto);

            // Apenas adiciona à lista local
            setProdutos((prev) => [...prev, produto]);

            resetForm();
            setShowProdList(true); // mostrar lista

        } catch (error) {
            alert("Erro ao adicionar produto.");
            console.error(error);
        }
    };


    const resetForm = () => {
        setNewProduto(prev => ({
            nome: "",
            sku: "",
            tag: "",
            quantidade: 0,
            precoUnitario: 0,
            valorVenda: 0,
            catalogo: true,
            fornecedorId: prev?.fornecedorId ?? 0,
        }));
    }

    return (
        showProdList ? (
            <ResumoProdutos produtos={produtos} />
        ) : (
            <main className="relative flex flex-col w-full min-h-screen">
                <Header title="Adicionar" subtitle="Produto" />

                {/* Grid */}
                <div className="flex flex-col gap-4 p-4 w-full">

                    <div className="flex justify-between">
                        <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl">
                            <ImageIcon fontSize="inherit" />
                        </div>

                        <ButtonFile onSelect={(file) => console.log(file)} label="Adicionar Imagem" accept="image/*" />
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col gap-2">
                        <Input
                            label="Nome"
                            name="product-name"
                            handleChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
                            value={newProduto.nome ?? ""}
                        />

                        <Select
                            label="Marca"
                            name="product-marca-name"
                            value={String(newProduto.fornecedorId)}
                            options={marcas}
                            optionKey={"id"}
                            optionName={"nome"}
                            optionValue={"id"}
                            handleChange={handleSelectedValue}
                        />
                        <div className="flex gap-2">
                            <Input
                                label="Preço Unitário"
                                name="product-price"
                                handleChange={(e) => setNewProduto({ ...newProduto, precoUnitario: Number(e.target.value) })}
                                value={newProduto.precoUnitario ?? ""}
                            />
                            <Input
                                label="Preço Venda"
                                name="product-price"
                                handleChange={(e) => setNewProduto({ ...newProduto, valorVenda: Number(e.target.value) })}
                                value={newProduto.valorVenda ?? ""}
                            />
                            <Input
                                label="Quant."
                                name="product-quant"
                                handleChange={(e) => setNewProduto({ ...newProduto, quantidade: Number(e.target.value) })}
                                value={newProduto.quantidade ?? ""}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <Button label={"Avançar"} fullWidth variant="outlined" onClick={adicionarProdutoNaLista} type="button" />
                    <Button label={"Enviar PDF"} fullWidth />


                </div>

            </main>
        )
    );
}