"use client";

import { useEffect, useState, useCallback, useRef } from "react";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import { produtoPorMarca } from "@/api/spring/services/ProdutoService";

import { Marca } from "@/models/Marca/Marca";
import { Produto } from "@/models/Produto/Produto";
import { Paginacao } from "@/models/Paginacao/Paginacao";

import { useParams } from "next/navigation";

import Header from "@/components/header";
import Input from "@/components/input";
import ProductsList from "@/components/products-list";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";

import AddCircle from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

export default function ProdutosPage() {
  const { marcaId: idMarca } = useParams();
  const [marca, setMarca] = useState<Marca>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginacao, setPaginacao] = useState<Paginacao<Produto> | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [tamanhoPagina] = useState(4);
  const [inputPesquisar, setInputPesquisar] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputPesquisar(value);
  };

  const carregarProdutos = async (
    pagina: number = 0,
    adicionar: boolean = false
  ) => {
    if (!idMarca) return;

    if (adicionar) {
      setCarregandoMais(true);
    } else {
      setCarregando(true);
    }

    try {
      const dadosPaginados = await produtoPorMarca(
        idMarca as string,
        pagina,
        tamanhoPagina
      );
      setPaginacao(dadosPaginados);

      if (adicionar) {
        setProdutos(prev => [...prev, ...dadosPaginados.content]);
      } else {
        setProdutos(dadosPaginados.content);
      }

      setPaginaAtual(pagina);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      if (!adicionar) {
        setProdutos([]);
        setPaginacao(null);
      }
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const carregarMaisProdutos = useCallback(() => {
    // Previne carregamento se já está carregando ou se é a última página
    if (!paginacao || paginacao.last || carregandoMais) {
      return;
    }
    carregarProdutos(paginaAtual + 1, true);
  }, [paginacao, carregandoMais, paginaAtual, idMarca, tamanhoPagina]);

  useEffect(() => {
    const fetchMarca = async () => {
      const marca = await marcaPorId(idMarca as string);
      if (marca) {
        setMarca(marca);
        carregarProdutos(0);
      }
    };
    fetchMarca();
  }, [idMarca]);

  // Scroll infinito com IntersectionObserver
  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Hook para gerenciar o comportamento do IntersectionObserver
  useEffect(() => {
    if (!sentinelaRef.current) return; // Verifica se o elemento sentinela está disponível

    // Desconecta o observer se já estamos na última página ou não há mais conteúdo
    if (
      paginacao?.last ||
      (paginacao?.content?.length === 0 && paginaAtual > 0)
    ) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const node = sentinelaRef.current; // Obtém o nó DOM da sentinela

    // Evita múltiplos observers desconectando o existente
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Cria um novo IntersectionObserver para monitorar a visibilidade da sentinela
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // Verifica se a sentinela está visível
          if (!carregandoMais && paginacao && !paginacao.last) {
            carregarProdutos(paginaAtual + 1, true); // Carrega mais produtos se necessário
          }
        }
      },
      {
        root: null, // Usa o viewport como root
        rootMargin: "0px", // Sem margem adicional
        threshold: 0.1, // Dispara quando qualquer parte da sentinela está visível
      }
    );

    observerRef.current.observe(node); // Inicia a observação do nó sentinela

    // Cleanup: desconecta o observer ao desmontar o componente ou atualizar dependências
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    paginacao?.last,
    carregandoMais,
    paginaAtual,
    paginacao?.content?.length,
  ]); // Dependências do hook

  const produtosFiltrados = (produtos || []).filter(produto =>
    produto.nome.toLowerCase().includes(inputPesquisar.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <Header title="Estoque" subtitle={marca?.nome ?? "Carregando..."}>
        <DropdownAdd>
          <Link href={`/estoque/marcas/${idMarca}/editar`}>
            <DropdownItem text="Editar Marca" icon={<EditIcon />} />
          </Link>

          <Link href={`/estoque/marcas/${idMarca}/produtos/adicionar`}>
            <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
          </Link>
        </DropdownAdd>
      </Header>

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <Input
          name="search"
          label="Pesquisar"
          iconSymbol={<SearchIcon />}
          handleChange={handleSearchChange}
        />
      </div>

      {carregando ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-pink-secondary-dark">Carregando produtos...</div>
        </div>
      ) : inputPesquisar.length === 0 ? (
        <>
          <div className="gap-4 grid grid-cols-1 px-4">
            <ProductsList produtos={produtos} marca={marca!} />
          </div>
          {/* Sentinela para IntersectionObserver */}
          <div ref={sentinelaRef} className="h-5" />
          {carregandoMais && (
            <div className="flex justify-center items-center py-4">
              <div className="text-pink-secondary-dark">
                Carregando mais produtos...
              </div>
            </div>
          )}
        </>
      ) : produtosFiltrados.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 px-4">
          <ProductsList produtos={produtosFiltrados} marca={marca!} />
        </div>
      ) : (
        <div className="flex justify-center items-center py-4 font-medium text-pink-secondary-dark">
          <h2 className="italic">Nenhum produto encontrado</h2>
        </div>
      )}
    </div>
  );
}
