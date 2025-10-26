"use client";

import { useState } from "react";

import InputNumber from "../input-number";

import { Delete, ImageOutlined } from "@mui/icons-material";

interface CardProductProps {
  nome: string;
  quantidade: number;
  produtoId: string;
  precoUnitario: number;
  imagemUrl: string;
  atualizar?: (produtoId: string, novaQtd: number) => void;
  deletar?: (produtoId: string) => void;
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
  const [imgErro, setImgErro] = useState(false);

  const imgSrcValida = !!imagemUrl && imagemUrl.trim() !== "";

  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-5 border-2 border-gray-dark h-full">
      <div className="flex items-center gap-4 w-full h-full">
        {imgSrcValida && !imgErro ? (
          <img
            src={imagemUrl}
            alt="Produto"
            className="w-12 h-16 object-cover rounded-lg"
            onError={() => setImgErro(true)}
          />
        ) : (
          <div className="w-12 h-16 text-4xl p-8 flex items-center justify-center bg-pink-default rounded-lg text-white">
            <ImageOutlined fontSize="inherit" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-xs text-text-default font-bold">{nome}</h2>
          <div className="flex flex-col gap-1">
            <p className="text-text-secondary text-xs">
              Preço Unit.: R$ {Number(precoUnitario).toFixed(0)}
            </p>
            <p className="text-text-secondary text-xs">
              Quantidade: {quantidade}
            </p>
            <p className="text-text-secondary text-xs">
              Subtotal: R$ {(Number(precoUnitario) * quantidade).toFixed(0)}
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
            onChange={novaQtd => atualizar(produtoId, novaQtd)}
            min={1}
            max={99}
            step={1}
          />
        )}
      </div>
    </div>
  );
}
