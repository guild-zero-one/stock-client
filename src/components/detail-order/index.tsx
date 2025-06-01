import { CalendarMonthOutlined } from "@mui/icons-material";

interface OrderFooterProps {
  index?: number;
  nomeCliente?: string;
  criadoEm?: string;
  quantidadeProdutos?: number;
}

export default function DetailOrder({
  index,
  nomeCliente,
  criadoEm,
  quantidadeProdutos,
}: OrderFooterProps) {
  return (
    <div className="flex justify-between px-4 w-full">
      <div className="flex flex-col items-start">
        <p className="text-sm text-text-secondary">Novo pedido {index}</p>
        {nomeCliente && <p>{nomeCliente}</p>}
      </div>
      <div className="flex flex-col items-end">
        {criadoEm && (
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <CalendarMonthOutlined fontSize="inherit" />
            <p>{criadoEm}</p>
          </span>
        )}
        {quantidadeProdutos && (
          <p className="font-bold">
            Produtos{" "}
            <span className="text-center bg-pink-default rounded-full text-white px-3 py-0.25 text-xs font-normal">
              {quantidadeProdutos}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
