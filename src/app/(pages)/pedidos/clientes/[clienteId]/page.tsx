"use client";

import { useEffect, useState, useMemo } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import { Marca } from "@/models/Marca/Marca";
import { todasMarcas } from "@/api/spring/services/MarcaService";

import Header from "@/components/header";
import Input from "@/components/input";
import MenuBrand from "@/components/menu-brand";

import SearchIcon from "@mui/icons-material/Search";

export default function EscolherMarca() {
  const [inputPesquisar, setInputPesquisar] = useState("");

  const [marcas, setMarcas] = useState<Marca[]>([]);

  const { clienteId } = useParams();

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const resultado = await todasMarcas();
        if (resultado) setMarcas(resultado.content ?? []);
      } catch (error) {
        console.error("Erro ao buscar marcas:", error);
      }
    };

    fetchMarcas();
  }, []);

  const marcasFiltradas = useMemo(() => {
    const termo = inputPesquisar.trim().toLowerCase();
    if (!termo) return marcas;
    return marcas.filter(marca => marca.nome.toLowerCase().includes(termo));
  }, [marcas, inputPesquisar]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white-default">
      <Header title="Escolher Produto" subtitle="Adicionar Pedido" />

      {/* Campo de pesquisa */}
      <div className="p-4">
        <Input
          name="search"
          label="Pesquisar"
          type="text"
          iconSymbol={<SearchIcon />}
          size="small"
          handleChange={e => setInputPesquisar(e.target.value)}
        />
      </div>

      {/* Conteúdo com marcas */}
      <div className="flex-1 bg-pink-secondary rounded-t-2xl p-4 pt-2 overflow-y-auto max-h-[85vh]">
        <div className="flex justify-center mb-4">
          <span className="font-bold text-pink-secondary-dark text-sm">
            Marcas
          </span>
        </div>

        {marcasFiltradas.length > 0 ? (
          <div className="flex flex-col gap-2">
            {marcasFiltradas.map(marca => (
              <Link
                key={marca.id}
                href={`/pedidos/clientes/${clienteId}/marcas/${marca.id}/produtos`}
              >
                <MenuBrand
                  name={marca.nome}
                  image={marca.imagemUrl}
                  description={marca.descricao}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-6 font-medium text-pink-secondary-dark">
            <h2 className="text-lg">Nenhuma marca encontrada :(</h2>
          </div>
        )}
      </div>
    </div>
  );
}
