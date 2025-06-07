import { CalendarMonth, ShoppingBagOutlined } from "@mui/icons-material";

type CardOrderProps = {
  index: number;
  nome: string;
  sobrenome: string;
  valorPedido: number;
  criadoEm: Date;
};

export default function CardOrder({
  index,
  nome,
  sobrenome,
  valorPedido,
  criadoEm,
}: CardOrderProps) {
  return (
    <div className="flex justify-between items-center w-full shadow-md/20 rounded-sm p-4 gap-4">
      {/* Icon */}
      <div className="flex items-center bg-pink-default p-2 rounded-lg">
        <ShoppingBagOutlined fontSize="large" className="text-white" />
      </div>

      {/* Info */}
      <div className="flex flex-col w-full gap-1">
        {/* Numero Pedido */}
        <p className="text-[10px] text-text-secondary uppercase">
          PEDIDO {index}
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
        {criadoEm && (
          <div className="flex items-center text-sm text-text-secondary gap-1">
            <CalendarMonth fontSize="inherit" />
            <p>
              {" "}
              {new Date(criadoEm).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
