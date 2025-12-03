"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Marca } from "@/models/Marca/Marca";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import { todasMarcas } from "@/api/spring/services/MarcaService";

import Link from "next/link";

import Header from "@/components/header";
import Input from "@/components/input";
import MenuBrand from "@/components/menu-brand";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";

export default function Estoque() {
  const [inputPesquisar, setInputPesquisar] = useState("");
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao<Marca> | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputPesquisar(value);
  };

  const carregarMarcas = async (pagina: number = 0, adicionar: boolean = false) => {
    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const response = await todasMarcas(pagina, 2);
      setPaginacao(response);

      if (adicionar) {
        setMarcas(prev => [...prev, ...response.content]);
      } else {
        setMarcas(response.content);
      }

      setPaginaAtual(pagina);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
      if (!adicionar) {
        setMarcas([]);
        setPaginacao(null);
      }
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const carregarMaisMarcas = useCallback(() => {
    if (!paginacao || paginacao.last || carregandoMais) {
      return;
    }
    carregarMarcas(paginaAtual + 1, true);
  }, [paginacao, carregandoMais, paginaAtual]);

  useEffect(() => {
    carregarMarcas(0);
  }, []);

  useEffect(() => {
    if (!sentinelaRef.current) return;

    if (paginacao?.last) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const node = sentinelaRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          carregarMaisMarcas();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(node);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [paginacao?.last, carregarMaisMarcas]);

  const marcasFiltradas = marcas.filter(marca =>
    marca.nome.toLowerCase().includes(inputPesquisar.toLowerCase().trim())
  );

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      <Header backRouter="/" title="Estoque" subtitle="Marca">
        <DropdownAdd>
          <Link href={"./marcas/adicionar"}>
            <DropdownItem text="Adicionar Marca" icon={<AddCircle />} />
          </Link>
        </DropdownAdd>
      </Header>

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          type="text"
          iconSymbol={<SearchIcon />}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="bottom-0 absolute flex flex-col bg-pink-secondary p-4 pb-0 rounded-t-2xl w-full h-[75%]">
        <div className="flex flex-col justify-center items-center my-1 w-full">
          <span className="font-bold text-pink-secondary-dark text-sm">
            Marcas
          </span>
        </div>
        <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto hide-scrollbar">
          {inputPesquisar.length === 0 ? (
            marcas.length > 0 ? (
              <>
                {marcas.map(marca => (
                  <Link key={marca.id} href={`./marcas/${marca.id}/produtos`}>
                    <MenuBrand
                      name={marca.nome}
                      image={marca.imagemUrl}
                      description={marca.descricao}
                    />
                  </Link>
                ))}
                <div ref={sentinelaRef} className="h-5" />
                {carregandoMais && (
                  <div className="flex justify-center items-center py-4">
                    <div className="text-pink-secondary-dark">
                      Carregando mais marcas...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
                <h2>Nenhuma marca cadastrada :(</h2>
              </div>
            )
          ) : marcasFiltradas.length > 0 ? (
            marcasFiltradas.map(marca => (
              <Link key={marca.id} href={`./marcas/${marca.id}/produtos`}>
                <MenuBrand
                  name={marca.nome}
                  image={marca.imagemUrl}
                  description={marca.descricao}
                />
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
              <h2>Nenhuma marca encontrada.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
