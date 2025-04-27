'use client'
import React from 'react';

type CategoriesMenuProps = {
    name: string;
    image: string;
    description: string;
    quantity?: number;
    onClick?: () => void;
};
export default function CategoriesMenu({
    name,
    image,
    description,
    quantity = 0,
    onClick = () => { },
}: CategoriesMenuProps) {

    return (
        <div className="flex flex-col gap-2 cursor-pointer" onClick={onClick}>
            <div className="flex flex-shrink-0 bg-white p-4 rounded-2xl w-full h-[35vh] min-h-[160px] max-h-[200px]">

                {/* Descrição Textual Categoria */}
                <div className="flex flex-col w-full">
                    {/* Titulo e Subtitulo*/}
                    <div className="flex flex-col w-full">
                        <h2 className="font-lexend font-medium text-xl/8">{name}</h2>
                        <span className="text-text-secondary text-xs">{description}</span>
                    </div>
                    {/* Quantidade de Produtos na categoria */}
                    <span className="mt-auto text-text-secondary text-xs">{quantity} produtos registrados</span>
                </div>

                {/* Imagem Categoria */}
                <div className="flex justify-center items-center w-full h-full">
                        <img className="w-full h-full object-contain" src={image} alt="Imagem da categoria" />
                </div>
            </div>
        </div>
    );
}