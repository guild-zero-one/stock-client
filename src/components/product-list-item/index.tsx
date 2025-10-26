import { Produto } from "@/models/Produto/Produto";
import InventoryIcon from "@mui/icons-material/Inventory";

interface ProductsListItemProps {
  produto: Produto;
}

export default function ProductsListItem({ produto }: ProductsListItemProps) {
  return (
    <div className="flex flex-col bg-white p-2 border border-gray-dark rounded w-full min-h-[45vh]">
      <div className="flex-1 w-full grow">
        {produto.imagemUrl ? (
          <img
            src={produto.imagemUrl}
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
