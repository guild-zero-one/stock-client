import { ImagemProduto } from "@/models/Imagem/ImagemProduto";
import { Produto } from "@/models/Produto/Produto";

import InventoryIcon from "@mui/icons-material/Inventory";

interface ProductsListItemProps {
  produto: Produto;
  imagem: ImagemProduto | undefined;
}

export default function ProductsListItem({
  produto,
  imagem,
}: ProductsListItemProps) {
  return (
    <div className="flex flex-col bg-white p-2 border border-gray-dark rounded w-full min-h-[45vh]">
      <div className="flex-1 w-full grow">
        {imagem ? (
          <img
            src={imagem.urlImagem}
            alt={produto.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <p>Imagem não encontrada</p>
        )}
      </div>
      <div>
        <h3 className="text-xs">{produto.nome}</h3>
        <p className="font-bold text-text-default text-sm">
          R$ {produto.valorVenda.toFixed(0)}
        </p>
        <p className="text-text-secondary text-xs">
          <InventoryIcon fontSize="inherit" /> {produto.quantidade} unidades
        </p>
      </div>
    </div>
  );
}
