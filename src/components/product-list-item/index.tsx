import { Produto } from "@/models/Produto";
import InventoryIcon from '@mui/icons-material/Inventory';

export default function ProdutctListItem({ produto }: { produto: Produto }) {
    return (
        <div className="flex flex-col bg-white p-2 border border-gray-dark rounded w-full min-h-[35vh]">
            <div className="flex-1 w-full grow">
                <img
                    src={produto.image}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h3 className="text-xs">{produto.name}</h3>
                <p className="font-bold text-text-default text-sm">R$ {produto.price}</p>
                <p className="text-text-secondary text-xs"><InventoryIcon fontSize="inherit" /> {produto.quantity} unidades</p>
            </div>
        </div>
    )
}