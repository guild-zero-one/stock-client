import { marcaPorId } from "@/api/spring/services/FornecedorService";
import AccordionProductList from "@/components/accordion/accordion-item";
import Accordion from "@/components/accordion/products-accordion";
import FooterOrder from "@/components/footer-order";
import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { ProdutoCreate } from "@/models/Produto/Produto";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResumoProdutos({ produtos }: { produtos: ProdutoCreate[] }) {

    const [marcas, setMarcas] = useState<Fornecedor[]>([]);

    useEffect(() => {

        const idsUnicos = Array.from(new Set(produtos.map(p => p.fornecedorId)));

        const fetchFornecedores = async () => {
            try {
                const respostas = await Promise.all(
                    idsUnicos.map(id => marcaPorId(id))
                );
                const fornecedoresValidos = respostas.filter(Boolean);
                setMarcas(fornecedoresValidos);
            } catch (erro) {
                console.error("Erro ao buscar fornecedores:", erro);
            }
        };

        fetchFornecedores();
    }, [produtos]);

    return (

        <div>
            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <ul>
                    {marcas.map(marca => {
                        const produtosDaMarca = produtos.filter(produto => produto.fornecedorId === marca.id);

                        return (
                            <li key={marca.id}>
                                <Accordion title={marca.nome} defaultOpen={true} badgeValue={produtosDaMarca.length}>
                                    <AccordionProductList produtos={produtosDaMarca} />
                                </Accordion>
                            </li>
                        );
                    })}
                </ul>

            </div>

        <FooterOrder total={0} onConfirm={function (): void {
                throw new Error("Function not implemented.");
            } } />
        </div>
    );
}
