import { Person, ShoppingBagOutlined } from "@mui/icons-material";

type CardCustomerProps = {
  nome: string;
  sobrenome: string;
  celular: string;
  qtdPedidos: number;
  ativo?: boolean;
};

export default function CardCustomer({
  nome,
  sobrenome,
  celular,
  qtdPedidos,
  ativo = true,
}: CardCustomerProps) {
  return (
    <div
      className={`flex justify-between items-center w-full shadow-md/10 rounded-sm p-4 gap-4 ${
        !ativo ? "opacity-50 bg-gray-100" : ""
      }`}
    >
      {/* Icon */}
      <div
        className={`flex items-center p-2 rounded-lg ${
          ativo ? "bg-pink-default" : "bg-gray-400"
        }`}
      >
        <Person fontSize="large" className="text-white" />
      </div>

      {/* Info */}
      <div className="flex flex-col w-full gap-2">
        <p
          className={`flex flex-row text-sm ${
            ativo ? "text-text-default" : "text-gray-500"
          }`}
        >
          {nome} {sobrenome ?? ""}
          {!ativo && (
            <span className="ml-1 text-xs text-red-500"> (Inativo)</span>
          )}
        </p>
        <p
          className={`text-sm ${
            ativo ? "text-text-secondary" : "text-gray-400"
          }`}
        >
          {celular}
        </p>
      </div>

      {/* Pedidos */}
      <div>
        <button className="relative flex items-center justify-center w-8 h-8">
          <ShoppingBagOutlined
            fontSize="small"
            className={ativo ? "text-text-secondary" : "text-gray-400"}
          />
          <div
            className={`absolute -top-2 -right-2 text-white text-center text-[10px] font-medium rounded-full px-2 py-0.25 ${
              ativo ? "bg-pink-default" : "bg-gray-400"
            }`}
          >
            {qtdPedidos}
          </div>
        </button>
      </div>
    </div>
  );
}
