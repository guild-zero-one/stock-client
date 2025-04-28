import { ImagemProduto } from "@/models/ImagemProduto";
import { Produto } from "@/models/Produto";

import InventoryIcon from "@mui/icons-material/Inventory";

interface ProductsListItemProps {
  produto: Produto;
  imagem: ImagemProduto;
}

export default function ProductsListItem({ produto, imagem }: ProductsListItemProps) {
  return (
    <div className="flex flex-col bg-white p-2 border border-gray-dark rounded w-full min-h-[35vh]">
      <div className="flex-1 w-full grow">
        <img src={imagem?.url_imagem} alt="" className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="text-xs">{produto.nome}</h3>
        <p className="font-bold text-text-default text-sm">R$ {produto.valor_venda}</p>
        <p className="text-text-secondary text-xs">
          <InventoryIcon fontSize="inherit" /> {produto.qtd} unidades
        </p>
      </div>
    </div>
  );
}
