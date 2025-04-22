import React from 'react';
import ProdutctListItem from '../product-list-item';
import { Produto } from "@/models/Produto";
import Link from 'next/link';
import { Marca } from '@/models/Marca';

export default function ProductsList({ produtos, marca }: { produtos: Produto[]; marca: Marca }) {
    if (!produtos || produtos.length === 0) {
        return (
          <div className="p-4 w-full text-center">
            <h2 className="text-gray-500">Sem produtos disponíveis</h2>
          </div>
        );
      }
    
      return (
        <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {produtos.map((produto) => (
                    <Link href={`/estoque/marcas/${marca.id}/produtos/${produto.id}`} key={produto.id}>
                    <ProdutctListItem produto={produto} />
                  </Link>
          ))}
        </div>
      );
  }
  

