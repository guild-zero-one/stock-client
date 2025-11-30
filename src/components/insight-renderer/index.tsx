import {
  formatCurrency,
  formatDate,
  formatStatusValue,
  formatKeyToTitle,
} from "@/utils/assistente/formatters";
import {
  isProductObject,
  isStatusAnalysisObject,
  isActionObject,
  isMetricsObject,
  isSimpleValue,
  getProductName,
} from "@/utils/assistente/validators";
import {
  ActionRenderer,
  formatActionToHumanText,
} from "@/components/action-renderer";
import { MetricsRenderer } from "@/components/metrics-renderer";

interface InsightRendererProps {
  data: any;
  isMainTitle?: boolean;
  parentKey?: string;
  themeColor?: "pink" | "purple" | "blue";
  supportPercentualTaxa?: boolean;
  supportPeriodoString?: boolean;
}

export function InsightRenderer({
  data,
  isMainTitle = false,
  parentKey = "",
  themeColor = "pink",
  supportPercentualTaxa = false,
  supportPeriodoString = false,
}: InsightRendererProps): React.ReactNode {
  const themeColorClass =
    themeColor === "pink"
      ? "text-pink-default"
      : themeColor === "purple"
      ? "text-purple-500"
      : "text-blue-500";

  // Detectar e formatar valores monetários
  if (typeof data === "number") {
    // Não formatar total_dias como moeda
    if (
      parentKey.toLowerCase().includes("total_dias") ||
      parentKey.toLowerCase().includes("total dias")
    ) {
      return <span className="text-sm text-text-default">{data}</span>;
    }
    // Formatação especial para Ticket Médio com 2 decimais
    if (
      parentKey.toLowerCase().includes("ticket") &&
      parentKey.toLowerCase().includes("medio")
    ) {
      return (
        <span className="text-sm text-text-default">{data.toFixed(2)}</span>
      );
    }
    const currencyKeys = [
      "receita",
      "valor",
      "preco",
      "total",
      "custo",
      "previsao",
      "desconto",
      "subtotal",
    ];
    if (currencyKeys.some(key => parentKey.toLowerCase().includes(key))) {
      return (
        <span className="text-sm text-text-default">
          {formatCurrency(data)}
        </span>
      );
    }
    // Adicionar % para taxas de crescimento percentual (se suportado)
    if (
      supportPercentualTaxa &&
      parentKey.toLowerCase().includes("taxa") &&
      parentKey.toLowerCase().includes("percentual")
    ) {
      return <span className="text-sm text-text-default">{data}%</span>;
    }
    return <span className="text-sm text-text-default">{data}</span>;
  }

  // Detectar e formatar datas
  if (typeof data === "string") {
    // Verificar se é uma string de período no formato "2025-11-01 a 2025-11-30" (se suportado)
    if (supportPeriodoString) {
      const periodoRegex = /^(\d{4}-\d{2}-\d{2})\s+a\s+(\d{4}-\d{2}-\d{2})$/;
      const periodoMatch = data.match(periodoRegex);
      if (periodoMatch) {
        const dataInicio = formatDate(periodoMatch[1]);
        const dataFim = formatDate(periodoMatch[2]);
        if (dataInicio && dataFim) {
          return (
            <span className="text-sm text-text-default">
              {dataInicio} - {dataFim}
            </span>
          );
        }
      }
    }

    // Verificar se é uma data ISO
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    const dateKeys = [
      "data",
      "data_inicio",
      "data_fim",
      "criado_em",
      "periodo",
      "inicio",
      "fim",
    ];
    if (
      dateRegex.test(data) &&
      dateKeys.some(key => parentKey.toLowerCase().includes(key))
    ) {
      const formatted = formatDate(data);
      if (!formatted)
        return <span className="text-sm text-text-default">{data}</span>;
      return <span className="text-sm text-text-default">{formatted}</span>;
    }

    // Verificar se é um número (taxa percentual como string) (se suportado)
    if (
      supportPercentualTaxa &&
      parentKey.toLowerCase().includes("taxa") &&
      parentKey.toLowerCase().includes("percentual")
    ) {
      const numValue = parseFloat(data);
      if (!isNaN(numValue)) {
        return <span className="text-sm text-text-default">{numValue}%</span>;
      }
    }

    // Verificar se contém POSITIVO ou NEGATIVO
    if (
      data.toUpperCase().includes("POSITIVO") ||
      data.toUpperCase().includes("NEGATIVO")
    ) {
      return (
        <span className="text-sm text-text-default">
          {formatStatusValue(data)}
        </span>
      );
    }

    // Se for texto, tentar quebrar em parágrafos
    const paragraphs = data.split("\n\n").filter((p: string) => p.trim());
    return (
      <div className="flex flex-col gap-3">
        {paragraphs.map((paragraph: string, idx: number) => (
          <p
            key={idx}
            className="text-sm text-text-default whitespace-pre-wrap"
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      // Verifica se é array de análise por status
      const isStatusAnalysisArray =
        data.length > 0 && isStatusAnalysisObject(data[0]);

      if (isStatusAnalysisArray) {
        const getStatusColor = (status: string): string => {
          const upperStatus = status.toUpperCase();
          if (upperStatus === "PENDENTE") return "text-yellow-600";
          if (upperStatus === "CONCLUIDO") return "text-ok-default";
          if (upperStatus === "CANCELADO") return "text-error-default";
          return "text-text-default";
        };

        return (
          <div className="flex flex-col gap-4">
            {data.map((item: any, idx: number) => {
              const status = item.status || item.Status || "";
              const quantidade = item.quantidade || item.Quantidade || 0;
              const valorTotal =
                item.valor_total || item.Valor_Total || item.valorTotal || 0;

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <h5
                    className={`text-base font-bold ${getStatusColor(status)}`}
                  >
                    {status}
                  </h5>
                  <div className="flex flex-col gap-1 pl-1">
                    <p className="text-sm text-text-default">
                      <span className="font-semibold">Quantidade:</span>{" "}
                      {quantidade}
                    </p>
                    <p className="text-sm text-text-default">
                      <span className="font-semibold">Valor Total:</span>{" "}
                      {formatCurrency(valorTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      // Verifica se é array de ações (usado em próxima-acao)
      const isActionArray = data.length > 0 && isActionObject(data[0]);

      if (isActionArray) {
        return (
          <div className="flex flex-col gap-4">
            {data.map((item: any, idx: number) => {
              const actionData = formatActionToHumanText(item);
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-3 border-l-2 border-purple-300 pl-4"
                >
                  <ActionRenderer actionData={actionData} titleSize="sm" />
                </div>
              );
            })}
          </div>
        );
      }

      // Verifica se é array de produtos
      const isProductArray = data.length > 0 && isProductObject(data[0]);

      if (isProductArray) {
        // Verificar se é contexto de Top 3 para limitar a 3 itens
        const parentKeyLower = parentKey.toLowerCase();
        const formattedTitle = formatKeyToTitle(parentKey).toLowerCase();

        const isTop3Context =
          (parentKeyLower.includes("top") &&
            (parentKeyLower.includes("3") ||
              parentKeyLower.match(/\btop\s*3/i))) ||
          formattedTitle.includes("top 3") ||
          (parentKeyLower.includes("produtos") &&
            parentKeyLower.includes("mais") &&
            parentKeyLower.includes("vendidos")) ||
          formattedTitle.includes("produtos mais vendidos");

        // Limitar a 3 itens apenas se for contexto de Top 3 e houver mais de 3 itens
        const productsToShow =
          isTop3Context && data.length > 3 ? data.slice(0, 3) : data;

        return (
          <ul className="flex flex-col gap-2 pl-5">
            {productsToShow.map((item: any, idx: number) => (
              <li key={idx} className="text-sm text-text-default list-disc">
                {getProductName(item)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <ul className="flex flex-col gap-2 pl-5">
          {data.map((item: any, idx: number) => (
            <li key={idx} className="text-sm text-text-default list-disc">
              <InsightRenderer
                data={item}
                isMainTitle={false}
                parentKey={parentKey}
                themeColor={themeColor}
                supportPercentualTaxa={supportPercentualTaxa}
                supportPeriodoString={supportPeriodoString}
              />
            </li>
          ))}
        </ul>
      );
    }

    // Se for um objeto de produto, mostra apenas o nome
    if (isProductObject(data)) {
      return (
        <p className="text-sm text-text-default">{getProductName(data)}</p>
      );
    }

    // Se for um objeto de ação, formata como texto humano (usado em próxima-acao)
    if (isActionObject(data)) {
      const actionData = formatActionToHumanText(data);
      return (
        <div className="flex flex-col gap-3 border-l-2 border-purple-300 pl-4">
          <ActionRenderer actionData={actionData} titleSize="base" />
        </div>
      );
    }

    // Se for um objeto de métricas, formata de forma compacta (usado em próxima-acao)
    if (isMetricsObject(data)) {
      return <MetricsRenderer data={data} />;
    }

    // Tratamento especial para Período Analisado (objetos com data_inicio e data_fim)
    if (data.data_inicio && data.data_fim) {
      const dataInicio = formatDate(data.data_inicio);
      const dataFim = formatDate(data.data_fim);

      // Usar o mesmo formato para todos os temas (igual ao previsao-demanda)
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h4
              className={
                isMainTitle
                  ? "text-lg font-bold text-text-default"
                  : `text-base font-bold ${themeColorClass}`
              }
            >
              {formatKeyToTitle("periodo_analisado")}
            </h4>
            <div className="text-sm text-text-default pl-1 flex flex-col gap-1">
              {dataInicio && dataFim && (
                <p>
                  {dataInicio} - {dataFim}
                </p>
              )}
            </div>
          </div>
          {/* Renderizar outros campos que não sejam data_inicio, data_fim e total_dias */}
          {Object.entries(data)
            .filter(
              ([key]) =>
                !["data_inicio", "data_fim", "total_dias"].includes(
                  key.toLowerCase()
                )
            )
            .map(([key, value]) => {
              const isSimple = isSimpleValue(value);

              if (isSimple) {
                let formattedValue: React.ReactNode;

                if (typeof value === "number") {
                  if (
                    key.toLowerCase().includes("ticket") &&
                    key.toLowerCase().includes("medio")
                  ) {
                    formattedValue = value.toFixed(2);
                  } else if (key.toLowerCase().includes("pedidos")) {
                    formattedValue = value;
                  } else {
                    const currencyKeys = [
                      "receita",
                      "valor",
                      "preco",
                      "custo",
                      "previsao",
                      "desconto",
                      "subtotal",
                    ];
                    if (currencyKeys.some(k => key.toLowerCase().includes(k))) {
                      formattedValue = formatCurrency(value);
                    } else {
                      formattedValue = value;
                    }
                  }
                } else if (typeof value === "string") {
                  if (
                    value.toUpperCase().includes("POSITIVO") ||
                    value.toUpperCase().includes("NEGATIVO")
                  ) {
                    formattedValue = formatStatusValue(value);
                  } else {
                    formattedValue = value;
                  }
                } else {
                  formattedValue = String(value ?? "");
                }

                return (
                  <div key={key} className="flex flex-col gap-2">
                    <p
                      className={
                        isMainTitle
                          ? "text-lg font-bold text-text-default"
                          : "text-base font-bold"
                      }
                    >
                      <span
                        className={
                          isMainTitle ? "text-text-default" : themeColorClass
                        }
                      >
                        {formatKeyToTitle(key)}:
                      </span>{" "}
                      <span className="font-normal !text-black">
                        {formattedValue}
                      </span>
                    </p>
                  </div>
                );
              }

              return (
                <div key={key} className="flex flex-col gap-2">
                  <h4
                    className={
                      isMainTitle
                        ? "text-lg font-bold text-text-default"
                        : `text-base font-bold ${themeColorClass}`
                    }
                  >
                    {formatKeyToTitle(key)}
                  </h4>
                  <div className="text-sm text-text-default pl-1">
                    <InsightRenderer
                      data={value}
                      isMainTitle={false}
                      parentKey={key}
                      themeColor={themeColor}
                      supportPercentualTaxa={supportPercentualTaxa}
                      supportPeriodoString={supportPeriodoString}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      );
    }

    // Renderização padrão para objetos
    return (
      <div className="flex flex-col gap-3">
        {Object.entries(data).map(([key, value]) => {
          // Verificar se o valor é um objeto com data_inicio e data_fim (período)
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            (value as any).data_inicio &&
            (value as any).data_fim
          ) {
            const periodoData = value as any;
            const dataInicio = formatDate(periodoData.data_inicio);
            const dataFim = formatDate(periodoData.data_fim);

            return (
              <div key={key} className="flex flex-col gap-2">
                <h4
                  className={
                    isMainTitle
                      ? "text-lg font-bold text-text-default"
                      : `text-base font-bold ${themeColorClass}`
                  }
                >
                  {formatKeyToTitle("periodo_analisado")}
                </h4>
                <div className="text-sm text-text-default pl-1 flex flex-col gap-1">
                  {dataInicio && dataFim && (
                    <p>
                      {dataInicio} - {dataFim}
                    </p>
                  )}
                </div>
                {/* Renderizar outros campos que não sejam data_inicio, data_fim e total_dias */}
                {Object.entries(periodoData)
                  .filter(
                    ([k]) =>
                      !["data_inicio", "data_fim", "total_dias"].includes(
                        k.toLowerCase()
                      )
                  )
                  .map(([k, v]) => (
                    <div key={k} className="text-sm text-text-default pl-1">
                      <InsightRenderer
                        data={v}
                        isMainTitle={false}
                        parentKey={k}
                        themeColor={themeColor}
                        supportPercentualTaxa={supportPercentualTaxa}
                        supportPeriodoString={supportPeriodoString}
                      />
                    </div>
                  ))}
              </div>
            );
          }

          // Se o valor for um objeto de ação, formata de forma especial
          if (isActionObject(value)) {
            const actionData = formatActionToHumanText(value);
            return (
              <div key={key} className="flex flex-col gap-2">
                <h4
                  className={
                    isMainTitle
                      ? "text-lg font-bold text-text-default"
                      : `text-base font-bold ${themeColorClass}`
                  }
                >
                  {formatKeyToTitle(key)}
                </h4>
                <div className="text-sm text-text-default pl-1">
                  <div className="flex flex-col gap-3 border-l-2 border-purple-300 pl-4">
                    <ActionRenderer actionData={actionData} titleSize="sm" />
                  </div>
                </div>
              </div>
            );
          }

          // Se o valor for um objeto de métricas, formata de forma compacta
          if (isMetricsObject(value)) {
            return (
              <div key={key} className="flex flex-col gap-2">
                <h4
                  className={
                    isMainTitle
                      ? "text-lg font-bold text-text-default"
                      : `text-base font-bold ${themeColorClass}`
                  }
                >
                  {formatKeyToTitle(key)}
                </h4>
                <div className="text-sm text-text-default pl-1">
                  <MetricsRenderer data={value} />
                </div>
              </div>
            );
          }

          const isSimple = isSimpleValue(value);

          if (isSimple) {
            let formattedValue: React.ReactNode;

            if (typeof value === "number") {
              if (
                key.toLowerCase().includes("total_dias") ||
                key.toLowerCase().includes("total dias")
              ) {
                formattedValue = value;
              } else if (
                key.toLowerCase().includes("ticket") &&
                key.toLowerCase().includes("medio")
              ) {
                formattedValue = value.toFixed(2);
              } else if (key.toLowerCase().includes("pedidos")) {
                formattedValue = value;
              } else {
                const currencyKeys = [
                  "receita",
                  "valor",
                  "preco",
                  "custo",
                  "previsao",
                  "desconto",
                  "subtotal",
                ];
                if (currencyKeys.some(k => key.toLowerCase().includes(k))) {
                  formattedValue = formatCurrency(value);
                } else if (
                  supportPercentualTaxa &&
                  key.toLowerCase().includes("taxa") &&
                  key.toLowerCase().includes("percentual")
                ) {
                  formattedValue = `${value}%`;
                } else {
                  formattedValue = value;
                }
              }
            } else if (typeof value === "string") {
              if (
                value.toUpperCase().includes("POSITIVO") ||
                value.toUpperCase().includes("NEGATIVO")
              ) {
                formattedValue = formatStatusValue(value);
              } else {
                formattedValue = value;
              }
            } else {
              formattedValue = String(value ?? "");
            }

            return (
              <div key={key} className="flex flex-col gap-2">
                <p
                  className={
                    isMainTitle
                      ? "text-lg font-bold text-text-default"
                      : "text-base font-bold"
                  }
                >
                  <span
                    className={
                      isMainTitle ? "text-text-default" : themeColorClass
                    }
                  >
                    {formatKeyToTitle(key)}:
                  </span>{" "}
                  <span className="font-normal !text-black">
                    {formattedValue}
                  </span>
                </p>
              </div>
            );
          }

          return (
            <div key={key} className="flex flex-col gap-2">
              <h4
                className={
                  isMainTitle
                    ? "text-lg font-bold text-text-default"
                    : `text-base font-bold ${themeColorClass}`
                }
              >
                {formatKeyToTitle(key)}
              </h4>
              <div className="text-sm text-text-default pl-1">
                <InsightRenderer
                  data={value}
                  isMainTitle={false}
                  parentKey={key}
                  themeColor={themeColor}
                  supportPercentualTaxa={supportPercentualTaxa}
                  supportPeriodoString={supportPeriodoString}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-sm text-text-default">{String(data)}</p>;
}
