import { ProdutoCreate } from "@/models/Produto/Produto";

import InputNumber from "@/components/input-number";

import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

interface AccordionProductListProps {
  produtos: ProdutoCreate[];
  onChangeQuantidade: (index: number, value: number) => void;
  onDeleteProduto: (index: number) => void;
}

export default function AccordionProductList({
  produtos = [],
  onChangeQuantidade,
  onDeleteProduto,
}: AccordionProductListProps) {
  return (
    <div>
      {produtos.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {produtos.map((produto, index) => (
            <li key={`${produto.nome}-${produto.idMarca}-${index}`}>
              <div className="flex place-items-center gap-2 p-4 border border-gray-dark rounded-2xl w-full h-46">
                <div className="flex justify-between place-items-center gap-2 w-full h-full">
                  <div className="flex justify-center place-items-center border border-gray-dark rounded w-36 h-36">
                    {produto.imagemUrl ? (
                      <img
                        src={
                          typeof produto.imagemUrl === "string"
                            ? produto.imagemUrl
                            : URL.createObjectURL(produto.imagemUrl)
                        }
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col text-sm">
                    <h2>{produto.nome}</h2>
                    <span>{`Preço Unitário: ${produto.precoUnitario.toFixed(
                      0
                    )}`}</span>
                    <span>{`Quantidade: ${produto.quantidade}`}</span>
                    <span>{`Subtotal: ${(
                      produto.precoUnitario * produto.quantidade
                    ).toFixed(0)}`}</span>
                  </div>

                  <div className="flex flex-col justify-between items-end h-full">
                    <DeleteIcon
                      className="text-text-secondary"
                      onClick={() => onDeleteProduto(index)}
                    />
                    <InputNumber
                      value={produto.quantidade}
                      onChange={value => onChangeQuantidade(index, value)}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h2>Sem produtos</h2>
      )}
    </div>
  );
}
