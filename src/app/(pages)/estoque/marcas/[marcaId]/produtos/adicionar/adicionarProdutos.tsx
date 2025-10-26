import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { marcaPorId } from "@/api/spring/services/MarcaService";
import {
  cadastrarProduto,
  produtoPorSku,
  atualizarProduto,
} from "@/api/spring/services/ProdutoService";

import { Marca } from "@/models/Marca/Marca";
import { ProdutoCreate } from "@/models/Produto/Produto";

import AccordionProductList from "@/components/accordion/accordion-item";
import Accordion from "@/components/accordion/products-accordion";

import FooterProductList from "@/components/footer-product-list";
import Button from "@/components/button";
import Modal from "@/components/modal-popup";

import {
  AssignmentLateOutlined,
  AssignmentTurnedInOutlined,
} from "@mui/icons-material";
import Toast from "@/components/toast";

interface ResumoProps {
  produtos: ProdutoCreate[];
  showProdList: boolean;
  setShowProdList: (value: boolean) => void;
  onProdutosChange?: (produtos: ProdutoCreate[]) => void;
}

export default function ResumoProdutos({
  produtos,
  showProdList,
  setShowProdList,
  onProdutosChange,
}: ResumoProps) {
  const [produtosResumo, setProdutosResumo] =
    useState<ProdutoCreate[]>(produtos);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"cancelar" | "cadastrar" | null>(
    null
  );

  const [toast, setToast] = useState<"success" | "error" | null>(null);

  const showToast = (type: "success" | "error" | null) => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  const toastMap = {
    success: {
      title: "Produtos cadastrados com sucesso",
      message: "Você será redirecionado para o estoque",
      type: "success",
    },
    error: {
      title: "Erro ao cadastrar produtos",
      message: "Verique as informações e tente novamente.",
      type: "error",
    },
  } as const;

  useEffect(() => {
    const idsUnicos = Array.from(new Set(produtos.map(p => p.idMarca)));

    const fetchMarcas = async () => {
      try {
        const respostas = await Promise.all(
          idsUnicos.map(id => marcaPorId(id))
        );
        const marcasValidas = respostas.filter(Boolean);
        setMarcas(marcasValidas);
      } catch (erro) {
        console.error("Erro ao buscar marcas:", erro);
      }
    };

    fetchMarcas();
  }, [produtos]);

  // Sincroniza produtosResumo com produtos quando produtos muda
  useEffect(() => {
    setProdutosResumo(produtos);
  }, [produtos]);

  const router = useRouter();

  const cadastrarProdutos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setModalAberto(false);

      for (const produto of produtosResumo) {
        const produtoExistente = await produtoPorSku(produto.sku);

        if (produtoExistente && produtoExistente.id) {
          const quantidadeAtualizada =
            produtoExistente.quantidade + produto.quantidade;
          produtoExistente.quantidade = quantidadeAtualizada;

          await atualizarProduto(produtoExistente.id, produtoExistente);
        } else {
          await cadastrarProduto(produto);
        }
      }

      showToast("success");

      setTimeout(() => {
        router.push("/estoque/marcas");
      }, 3000);
    } catch (error) {
      console.error("Erro ao cadastrar produtos:", error);
      showToast("error");
    }
  };

  const cancelarPedido = () => {
    router.push("/estoque/marcas");
  };

  const totalGeral = useMemo(
    () =>
      produtosResumo.reduce(
        (acc, prod) =>
          acc +
          Number(prod.quantidade) *
            Number(prod.valorVenda ?? prod.precoUnitario ?? 0),
        0
      ),
    [produtosResumo]
  );

  const handleChangeQuantidade = (index: number, novaQuantidade: number) => {
    setProdutosResumo(prev =>
      prev.map((prod, i) =>
        i === index ? { ...prod, quantidade: novaQuantidade } : prod
      )
    );
  };

  const handleDeleteProduto = (index: number) => {
    const novosProdutos = produtosResumo.filter((_, i) => i !== index);
    setProdutosResumo(novosProdutos);

    if (onProdutosChange) {
      onProdutosChange(novosProdutos);
    }
  };

  return (
    <div>
      {toast && <Toast {...toastMap[toast]} />}

      {/* Grid */}
      <div className="flex flex-col gap-4 p-4 w-full pb-18">
        <ul>
          {marcas.map(marca => {
            const produtosDaMarca = produtosResumo
              .map((produto, i) => ({ produto, i }))
              .filter(({ produto }) => produto.idMarca === marca.id);

            return (
              <li key={marca.id}>
                <Accordion
                  title={marca.nome}
                  defaultOpen={true}
                  badgeValue={produtosDaMarca.length}
                >
                  <AccordionProductList
                    produtos={produtosDaMarca.map(({ produto }) => produto)}
                    onChangeQuantidade={(index, novaQuantidade) => {
                      const idxReal = produtosDaMarca[index].i;
                      handleChangeQuantidade(idxReal, novaQuantidade);
                    }}
                    onDeleteProduto={index => {
                      const idxReal = produtosDaMarca[index].i;
                      handleDeleteProduto(idxReal);
                    }}
                  />
                </Accordion>

                <Modal
                  open={modalAberto}
                  icon={
                    modalTipo === "cancelar" ? (
                      <AssignmentLateOutlined fontSize="inherit" />
                    ) : (
                      <AssignmentTurnedInOutlined fontSize="inherit" />
                    )
                  }
                  onClose={() => {
                    setModalAberto(false);
                  }}
                  title={
                    modalTipo === "cancelar" ? (
                      <p>Cancelar cadastro de produtos</p>
                    ) : (
                      <p>Cadastrar produtos</p>
                    )
                  }
                  body={
                    modalTipo === "cancelar" ? (
                      <div className="flex justify-center flex-col gap-4">
                        <span className="flex flex-col gap-1">
                          <p className="w-full text-center">
                            Deseja cancelar o cadastramento deste lote?
                          </p>
                          <p className="text-pink-default font-bold text-center">
                            Essa ação é irreversível e não poderá ser desfeita.
                          </p>
                        </span>

                        <span className="flex flex-col gap-2">
                          <Button
                            onClick={() => setModalAberto(false)}
                            fullWidth
                            label="Não, não desejo cancelar"
                            variant="outlined"
                          ></Button>
                          <Button
                            onClick={cancelarPedido}
                            fullWidth
                            label="Sim, desejo cancelar"
                          ></Button>
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={cadastrarProdutos}
                        className="flex justify-center flex-col gap-2"
                      >
                        <p className="w-full text-center">
                          Deseja cadastrar lote de produtos?
                        </p>

                        <Button
                          fullWidth
                          variant="outlined"
                          label="Não, desejo adicionar mais produtos"
                          onClick={() => setModalAberto(false)}
                        ></Button>
                        <Button
                          type="submit"
                          fullWidth
                          label="Sim, desejo Cadastrar"
                        ></Button>
                      </form>
                    )
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Agora o total vai certinho pro footer */}
      <FooterProductList
        total={totalGeral}
        onAdd={() => setShowProdList(false)}
        onConfirm={() => {
          setModalAberto(true), setModalTipo("cadastrar");
        }}
        onCancel={() => {
          setModalAberto(true), setModalTipo("cancelar");
        }}
      />
    </div>
  );
}
