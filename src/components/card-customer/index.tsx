import { Person, ShoppingBagOutlined } from "@mui/icons-material";

type CardCustomerProps = {
  nome: string;
  sobrenome: string;
  contato: string;
  qtdPedidos: number;
};

export default function CardCustomer({
  nome,
  sobrenome,
  contato,
  qtdPedidos,
}: CardCustomerProps) {
  return (
    <div className="flex justify-between items-center w-full shadow-sm rounded-sm p-4 gap-4">
      {/* Icon */}
      <div className="flex items-center bg-pink-default p-2 rounded-lg">
        <Person fontSize="large" className="text-white" />
      </div>

      {/* Info */}
      <div className="flex flex-col w-full gap-2">
        <p className="flex flex-row text-sm text-text-default">
          {nome} {sobrenome ?? ""}
        </p>
        <p className="text-sm text-text-secondary">{contato}</p>
      </div>

      {/* Pedidos */}
      <div>
        <button className="relative flex items-center justify-center w-8 h-8">
          <ShoppingBagOutlined
            fontSize="small"
            className="text-text-secondary"
          />
          <div className="absolute -top-2 -right-2 bg-pink-default text-white text-center text-[10px] font-medium rounded-full px-2 py-0.25">
            {qtdPedidos}
          </div>
        </button>
      </div>
    </div>
  );
}
