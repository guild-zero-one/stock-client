import { useState, useEffect, useRef } from "react";

interface UseInsightDataOptions {
  fetchFunction: (periodo: string) => Promise<any>;
  errorMessage?: string;
}

export function useInsightData({
  fetchFunction,
  errorMessage,
}: UseInsightDataOptions) {
  const [toast, setToast] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<any>(null);
  const [periodo, setPeriodo] = useState<string>("mes_atual");
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  const showToast = (type: "success" | "error") => {
    setToast(null);
    setTimeout(() => {
      setToast(type);
    }, 10);
  };

  useEffect(() => {
    isMountedRef.current = true;
    const currentRequestId = ++requestIdRef.current;

    const fetchInsight = async () => {
      try {
        setLoading(true);
        const data = await fetchFunction(periodo);

        // Só atualiza o estado se esta ainda for a requisição mais recente e o componente estiver montado
        if (isMountedRef.current && currentRequestId === requestIdRef.current) {
          setInsight(data);
          showToast("success");
        }
      } catch (error) {
        if (isMountedRef.current && currentRequestId === requestIdRef.current) {
          console.error(errorMessage || "Erro ao buscar dados:", error);
          showToast("error");
        }
      } finally {
        if (isMountedRef.current && currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchInsight();

    // Cleanup: marca como desmontado quando o componente desmonta ou período muda
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodo(e.target.value);
  };

  return {
    toast,
    loading,
    insight,
    periodo,
    handlePeriodoChange,
  };
}
