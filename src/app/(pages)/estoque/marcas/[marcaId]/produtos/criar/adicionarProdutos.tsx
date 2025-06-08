import { ProdutoCreate } from "@/models/Produto/Produto";

export default function ResumoProdutos({ produtos }: { produtos: ProdutoCreate[] }) {
    return (
        <div>
            <h2>Resumo dos Produtos</h2>
            <ul>
                {produtos.map((p, i) => (
                    <li key={i}>
                      {p.nome} - Quant: {p.quantidade} - Preço: {p.precoUnitario}
                    </li>
                ))}
            </ul>
        </div>
    );
}
