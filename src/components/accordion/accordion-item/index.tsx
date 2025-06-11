import InputNumber from "@/components/input-number";
import { Produto, ProdutoCreate } from "@/models/Produto/Produto"
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
interface AccordionProductListProps {
    produtos: ProdutoCreate[]
}

export default function AccordionProductList({ produtos = [] }: AccordionProductListProps
) {
    return (
        <div>
            {produtos.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {produtos.map((produto, index) => (
                        <li key={index}>
                            <div className="flex place-items-center gap-2 p-4 border border-gray-dark rounded-2xl w-full h-46">
                                <div className="flex justify-between place-items-center gap-2 w-full h-full">
                                    <div className="flex justify-center place-items-center border border-gray-dark rounded w-36 h-36">
                                        {produto.imagem ? (
                                            <img
                                                src={
                                                    typeof produto.imagem === "string"
                                                        ? produto.imagem
                                                        : URL.createObjectURL(produto.imagem)
                                                }
                                                alt={produto.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2>{produto.nome}</h2>
                                        <span>{`Preço Unitário: ${produto.precoUnitario}`}</span>
                                        <span>{`Subtotal: ${0}`}</span>
                                    </div>

                                    <div>
                                        <DeleteIcon />
                                        <InputNumber value={0} onChange={function (value: number): void {
                                            throw new Error("Function not implemented.");
                                        } } />


                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <h2>sem produto</h2>
            )}
        </div>
    )
}