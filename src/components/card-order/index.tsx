import { CalendarMonth, ShoppingBagOutlined } from "@mui/icons-material";

type CardOrderProps = {
  numero: number;
  nome: string;
  sobrenome: string;
  valorPedido: number;
  dataCriacao: string;
};

export default function CardOrder({
  numero,
  nome,
  sobrenome,
  valorPedido,
  dataCriacao,
}: CardOrderProps) {
  return (
    <div className="flex justify-between items-center w-full shadow-sm rounded-sm p-4 gap-4">
      {/* Icon */}
      <div className="flex items-center bg-pink-default p-2 rounded-lg">
        <ShoppingBagOutlined fontSize="large" className="text-white" />
      </div>

      {/* Info */}
      <div className="flex flex-col w-full gap-1">
        {/* Numero Pedido */}
        <p className="text-[10px] text-text-secondary uppercase">
          PEDIDO {numero}
        </p>
        {/* Nome Cliente */}
        <h2 className="flex flex-row text-sm text-text-default">
          {nome} {sobrenome ?? ""}
        </h2>
        {/* Valor Pedido */}
        <p className="text-sm text-text-secondary font-bold">
          R$ {valorPedido}
        </p>
        {/* Data Pedido */}
        <div className="flex items-center text-xs text-text-secondary gap-1">
          <CalendarMonth fontSize="small" />
          <p>{dataCriacao}</p>
        </div>
      </div>
    </div>
  );
}
