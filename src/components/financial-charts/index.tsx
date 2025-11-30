"use client";

import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Product {
  nome: string;
  quantidade_vendida?: number;
  quantidade_total?: number;
  receita_gerada?: number;
  receita?: number;
}

interface StatusItem {
  status: string;
  quantidade: number;
  valor_total: number;
}

interface FinancialChartsProps {
  produtosMaisVendidos?: Product[];
  analiseStatus?: StatusItem[];
}

export function FinancialCharts({
  produtosMaisVendidos = [],
  analiseStatus = [],
}: FinancialChartsProps) {
  // Preparar dados para gráfico de produtos (barras horizontais)
  const produtosData = produtosMaisVendidos.slice(0, 5).map((p) => ({
    nome: p.nome,
    receita: p.receita_gerada || p.receita || 0,
  }));

  const produtosOptions = {
    chart: {
      id: "produtos-bar",
      toolbar: { show: false },
      type: "bar" as const,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: "right" as const,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) =>
        "R$ " + val.toLocaleString("pt-BR", { minimumFractionDigits: 0 }),
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#1e1b18"],
      },
    },
    xaxis: {
      categories: produtosData.map((p) => p.nome),
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Nunito, Arial, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          fontFamily: "Nunito, Arial, sans-serif",
        },
        maxWidth: 120,
      },
    },
    colors: ["#a6036d"],
    tooltip: {
      y: {
        formatter: (val: number) =>
          "R$ " + val.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
              maxWidth: 100,
            },
          },
        },
      },
    ],
  };

  const produtosSeries = [
    {
      name: "Receita",
      data: produtosData.map((p) => p.receita),
    },
  ];

  // Preparar dados para gráfico de status (pizza)
  const statusData = analiseStatus.map((s) => ({
    status: s.status || "Sem status",
    quantidade: s.quantidade,
    valor: s.valor_total,
  }));

  const getStatusColor = (status: string): string => {
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes("CONCLUIDO") || upperStatus.includes("ENTREGUE")) {
      return "#769b06"; // ok-default
    }
    if (upperStatus.includes("PENDENTE") || upperStatus.includes("AGUARDANDO")) {
      return "#f59e0b"; // yellow-600
    }
    if (upperStatus.includes("CANCELADO")) {
      return "#dc3c18"; // error-default
    }
    return "#a6036d"; // pink-default
  };

  const statusOptions = {
    chart: {
      id: "status-pie",
      toolbar: { show: false },
      type: "donut" as const,
    },
    labels: statusData.map((s) => s.status),
    colors: statusData.map((s) => getStatusColor(s.status)),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1) + "%",
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#1e1b18"],
      },
    },
    legend: {
      position: "bottom" as const,
      fontSize: "12px",
      fontFamily: "Nunito, Arial, sans-serif",
    },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          const status = statusData[opts.seriesIndex];
          return `Quantidade: ${status.quantidade}\nValor: R$ ${status.valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            fontSize: "10px",
          },
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
        },
      },
    ],
  };

  const statusSeries = statusData.map((s) => s.valor);

  return (
    <div className="flex flex-col gap-4 w-full">
      {produtosData.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4 w-full overflow-x-auto">
          <h3 className="text-base sm:text-lg font-bold text-text-default mb-3 sm:mb-4">
            Produtos Mais Vendidos
          </h3>
          <div className="min-w-[300px]">
            <ApexCharts
              options={produtosOptions}
              series={produtosSeries}
              type="bar"
              height={Math.max(250, produtosData.length * 60)}
            />
          </div>
        </div>
      )}

      {statusData.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4 w-full">
          <h3 className="text-base sm:text-lg font-bold text-text-default mb-3 sm:mb-4">
            Distribuição por Status
          </h3>
          <div className="h-[300px] sm:h-[350px]">
            <ApexCharts
              options={statusOptions}
              series={statusSeries}
              type="donut"
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
}

