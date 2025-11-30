import { formatCurrency, formatKeyToTitle } from "@/utils/assistente/formatters";

interface MetricsRendererProps {
  data: any;
}

export function MetricsRenderer({ data }: MetricsRendererProps): React.ReactNode {
  // Renderiza métricas de forma compacta: Rótulo: Valor
  return (
    <div className="flex flex-col gap-1 text-sm text-text-default">
      {Object.entries(data).map(([key, value]) => {
        let displayValue: React.ReactNode = String(value);

        // Formata valores monetários
        if (typeof value === "number") {
          const currencyKeys = [
            "receita",
            "valor",
            "preco",
            "total",
            "custo",
            "desconto",
            "subtotal",
          ];
          // Não formata ticket médio como moeda, mantém o número com decimais
          const isTicketMedio =
            key.toLowerCase().includes("ticket") &&
            key.toLowerCase().includes("medio");

          if (
            currencyKeys.some(k => key.toLowerCase().includes(k)) &&
            !isTicketMedio
          ) {
            displayValue = formatCurrency(value);
          } else if (isTicketMedio) {
            // Formata ticket médio com 2 casas decimais
            displayValue = value.toFixed(2);
          } else {
            displayValue = value;
          }
        }

        return (
          <p key={key}>
            <span className="font-semibold">{formatKeyToTitle(key)}: </span>
            <span>{displayValue}</span>
          </p>
        );
      })}
    </div>
  );
}

