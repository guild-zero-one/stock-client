import { AlertasData } from "@/models/Assistente/types";
import { getProductName } from "@/utils/assistente/validators";

export function getProductNameWithQuantity(item: any): string {
  // Extrai o nome do produto com quantidade entre parênteses
  let nome = getProductName(item);
  
  // Remove qualquer quantidade que já esteja no nome (padrão: "(X itens)" ou "(X item)")
  nome = nome.replace(/\s*\(\d+\s*(item|itens)\)\s*$/i, '').trim();
  
  // Tenta obter a quantidade de diferentes campos possíveis
  const quantidade = 
    item?.quantidade_atual ?? 
    item?.Quantidade_Atual ?? 
    item?.quantidade ?? 
    item?.Quantidade ?? 
    null;
  
  if (quantidade !== null && quantidade !== undefined) {
    const qtd = typeof quantidade === 'number' ? quantidade : parseInt(quantidade);
    if (!isNaN(qtd)) {
      return `${nome} (${qtd} ${qtd === 1 ? 'item' : 'itens'})`;
    }
  }
  
  return nome;
}

function renderResumo(resumo: any): React.ReactNode {
  if (!resumo) return null;

  const totalCriticos = resumo.total_criticos ?? resumo.Total_Criticos ?? 0;
  const totalAtencao = resumo.total_atencao ?? resumo.Total_Atencao ?? 0;
  const produtosAnalisados = resumo.produtos_analisados ?? resumo.Produtos_Analisados ?? 0;
  const produtosPrioritarios = resumo.produtos_prioritarios ?? resumo.Produtos_Prioritarios ?? 0;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-text-default">Resumo</h3>
      <div className="flex flex-col gap-2 pl-1">
        <p className="text-sm text-text-default">
          <span className="font-semibold text-error-default">Total Críticos:</span> {totalCriticos}
        </p>
        <p className="text-sm text-text-default">
          <span className="font-semibold text-yellow-600">Total Atenção:</span> {totalAtencao}
        </p>
        <p className="text-sm text-text-default">
          <span className="font-semibold">Produtos Analisados:</span> {produtosAnalisados}
        </p>
        <p className="text-sm text-text-default">
          <span className="font-semibold">Produtos Prioritários:</span> {produtosPrioritarios}
        </p>
      </div>
    </div>
  );
}

function renderListaAlertas(alertas: any[], titulo: string, isCritico: boolean = false): React.ReactNode {
  const corTitulo = isCritico ? "text-error-default" : "text-yellow-600";
  
  if (!alertas || alertas.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className={`text-lg font-bold ${corTitulo}`}>{titulo}</h3>
        <p className="text-sm text-text-default pl-1">Nenhum alerta</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className={`text-lg font-bold ${corTitulo}`}>{titulo}</h3>
      <ul className="flex flex-col gap-2 pl-5">
        {alertas.map((item: any, idx: number) => (
          <li key={idx} className="text-sm text-text-default list-disc">
            {getProductNameWithQuantity(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AlertasRendererProps {
  data: AlertasData;
}

export function AlertasRenderer({ data }: AlertasRendererProps): React.ReactNode {
  if (!data) return null;

  const resumo = data.resumo ?? data.Resumo;
  const alertasCriticos = data.alertas_criticos ?? data.Alertas_Criticos ?? [];
  const alertasAtencao = data.alertas_atencao ?? data.Alertas_Atencao ?? [];
  const recomendacoes = data.recomendacoes_gerais ?? data.Recomendacoes_Gerais ?? [];

  return (
    <div className="flex flex-col gap-6">
      {resumo && renderResumo(resumo)}
      {renderListaAlertas(alertasCriticos, "Alertas Críticos", true)}
      {renderListaAlertas(alertasAtencao, "Alertas Atenção", false)}
      {recomendacoes && recomendacoes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-text-default">Recomendações Gerais</h3>
          <ul className="flex flex-col gap-2 pl-5">
            {recomendacoes.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-text-default list-disc">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

