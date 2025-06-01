import { Dispatch } from "react";

import InputNumber from "../input-number";
import { Delete } from "@mui/icons-material";
import OrderFooter from "../footer-order";

interface CardProductProps {
  nome: string;
  quantidade: number;
  produtoId: number;
  precoUnitario: number;
  imagemUrl: string;
  atualizar?: (produtoId: number, novaQtd: number) => void;
  deletar?: (produtoId: number) => void;
}

export default function CardProduct({
  nome,
  produtoId,
  quantidade,
  precoUnitario,
  imagemUrl,
  atualizar,
  deletar,
}: CardProductProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-5 border-2 border-gray-dark h-full">
      <div className="flex items-center gap-4 w-full h-full">
        <img
          src={imagemUrl}
          alt="Produto"
          className="w-12 h-16 object-cover rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-xs text-text-default font-bold">{nome}</h2>
          <div className="flex flex-col gap-1">
            <p className="text-text-secondary text-xs">
              Preço Unit.: R$ {precoUnitario}
            </p>
            <p className="text-text-secondary text-xs">
              Quantidade: {quantidade}
            </p>
            <p className="text-text-secondary text-xs">
              Subtotal: R$ {precoUnitario * quantidade}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-8">
        {deletar && (
          <button
            title="delete"
            type="button"
            onClick={() => deletar(produtoId)}
          >
            <Delete className="text-text-secondary" />
          </button>
        )}
        {atualizar && (
          <InputNumber
            value={quantidade}
            onChange={(novaQtd) => atualizar(produtoId, novaQtd)}
            min={1}
            max={99}
            step={1}
          />
        )}
      </div>
    </div>
  );
}
