import { ActionData } from "@/models/Assistente/types";

export function formatActionToHumanText(action: any): ActionData {
  // Formata uma ação (prioritária ou secundária) em texto humano e natural
  if (!action || typeof action !== "object") {
    return {
      titulo: "",
      descricao: "",
      prioridade: "",
      impactoEsperado: "",
      prazoSugerido: "",
    };
  }

  const titulo = action.titulo || action.Titulo || action.título || "";
  const descricao = action.descricao || action.Descricao || "";
  const prioridade = action.prioridade || action.Prioridade || "";
  const impactoEsperado =
    action.impacto_esperado ||
    action.Impacto_Esperado ||
    action.impactoEsperado ||
    "";
  const prazoSugerido =
    action.prazo_sugerido ||
    action.Prazo_Sugerido ||
    action.prazoSugerido ||
    "";

  return { titulo, descricao, prioridade, impactoEsperado, prazoSugerido };
}

export function getPrioridadeColor(prioridade: string): string {
  // Retorna a cor baseada na prioridade
  const upperPrioridade = prioridade.toUpperCase();
  if (upperPrioridade.includes("ALTA") || upperPrioridade.includes("ALTO")) {
    return "text-error-default";
  }
  if (
    upperPrioridade.includes("MÉDIO") ||
    upperPrioridade.includes("MEDIO") ||
    upperPrioridade.includes("MÉDIA") ||
    upperPrioridade.includes("MEDIA")
  ) {
    return "text-yellow-600";
  }
  if (upperPrioridade.includes("BAIXO") || upperPrioridade.includes("BAIXA")) {
    return "text-ok-default";
  }
  return "text-text-default";
}

export function formatPrioridade(prioridade: string): string {
  // Corrige acentuação e formata prioridade
  const upperPrioridade = prioridade.toUpperCase();
  if (upperPrioridade.includes("MEDIO")) {
    return prioridade.replace(/medio/gi, "Médio");
  }
  if (upperPrioridade.includes("MEDIA")) {
    return prioridade.replace(/media/gi, "Média");
  }
  if (upperPrioridade.includes("ALTO")) {
    return prioridade.replace(/alto/gi, "Alto");
  }
  if (upperPrioridade.includes("ALTA")) {
    return prioridade.replace(/alta/gi, "Alta");
  }
  if (upperPrioridade.includes("BAIXO")) {
    return prioridade.replace(/baixo/gi, "Baixo");
  }
  if (upperPrioridade.includes("BAIXA")) {
    return prioridade.replace(/baixa/gi, "Baixa");
  }
  return prioridade;
}

interface ActionRendererProps {
  actionData: ActionData;
  titleSize?: "base" | "sm";
}

export function ActionRenderer({
  actionData,
  titleSize = "base",
}: ActionRendererProps): React.ReactNode {
  // Renderiza o conteúdo de uma ação de forma formatada
  const titleClass =
    titleSize === "base"
      ? "text-base font-bold text-purple-500"
      : "text-sm font-semibold text-purple-600";

  return (
    <div className="flex flex-col gap-3">
      {actionData.titulo && <h4 className={titleClass}>{actionData.titulo}</h4>}

      {actionData.descricao && (
        <p className="text-sm text-text-default whitespace-pre-wrap">
          {actionData.descricao}
        </p>
      )}

      {(actionData.prioridade ||
        actionData.impactoEsperado ||
        actionData.prazoSugerido) && (
        <div className="flex flex-col gap-1 text-sm text-text-default">
          {actionData.prioridade && (
            <p>
              <span className="font-semibold">Prioridade: </span>
              <span
                className={`font-semibold ${getPrioridadeColor(
                  actionData.prioridade
                )}`}
              >
                {formatPrioridade(actionData.prioridade)}
              </span>
            </p>
          )}
          {actionData.impactoEsperado && (
            <p>
              <span className="font-semibold">Impacto Esperado: </span>
              <span>{formatPrioridade(actionData.impactoEsperado)}</span>
            </p>
          )}
          {actionData.prazoSugerido && (
            <p>
              <span className="font-semibold">Prazo Sugerido: </span>
              <span>{actionData.prazoSugerido}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

