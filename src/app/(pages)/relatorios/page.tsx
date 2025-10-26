"use client";

import { useState, useEffect } from "react";

import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

import {
  top3ProdutosMes,
  totalVendasMensal,
  quantidadePedidosUltimos6Meses,
  faturamentoUltimos6Meses,
} from "@/api/spring/services/RelatorioService";

import { Top3ProdutosResponse } from "@/models/Relatorio/Top3ProdutosResponse";

import Header from "@/components/header";

function ordenarAnoMes(keys: string[]) {
  return keys.sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    return ay !== by ? ay - by : am - bm;
  });
}

export default function Dashboard() {
  const [kpiVendas, setKpiVendas] = useState(0);
  const [kpiTop3Produtos, setKpiTop3Produtos] = useState<
    Top3ProdutosResponse[]
  >([]);
  const [graphQuantidadePedidos, setGraphQuantidadePedidos] = useState<
    Record<string, number>
  >({});
  const [graphFaturamento, setGraphFaturamento] = useState<
    Record<string, number>
  >({});
  const [mesesDinamicos, setMesesDinamicos] = useState<string[]>([]);
  const [graphQtdSeries, setGraphQtdSeries] = useState([
    { name: "Qtd. Pedidos", data: [] as number[] },
  ]);
  const [graphFatSeries, setGraphFatSeries] = useState([
    { name: "Faturamento", data: [] as number[] },
  ]);

  const getMaxFromData = (data: number[]) => {
    const max = Math.max(...data, 1);
    return Math.ceil(max);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalVendas = await totalVendasMensal();
        setKpiVendas(totalVendas);

        const top3Produtos = await top3ProdutosMes();
        setKpiTop3Produtos(top3Produtos);

        const qtd6mes = await quantidadePedidosUltimos6Meses();
        setGraphQuantidadePedidos(qtd6mes);

        const val6meses = await faturamentoUltimos6Meses();
        setGraphFaturamento(val6meses);

        const mesesOrdenados = ordenarAnoMes(Object.keys(qtd6mes).reverse());

        setMesesDinamicos(mesesOrdenados);

        const seriesQtdArray = mesesOrdenados.map(mes => qtd6mes[mes] ?? 0);
        const seriesFatArray = mesesOrdenados.map(
          mes => Number(val6meses[mes]) ?? 0
        );

        setGraphQtdSeries([{ name: "Qtd. Pedidos", data: seriesQtdArray }]);
        setGraphFatSeries([{ name: "Faturamento", data: seriesFatArray }]);
      } catch (error) {
        console.error("Erro ao buscar dados de relatórios:", error);
      }
    };
    fetchData();
  }, []);

  const maxQtd = getMaxFromData(graphQtdSeries[0].data);
  const maxFat = getMaxFromData(graphFatSeries[0].data);

  const graphQtdOptions = {
    chart: { id: "vendas-bar", toolbar: { show: false } },
    title: {
      text: "Qtd. Vendas Mensais",
      align: "left" as const,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Nunito, Arial, sans-serif",
        color: "#a6036d",
      },
    },
    xaxis: { categories: mesesDinamicos },
    yaxis: {
      min: 0,
      max: maxQtd,
      tickAmount: Math.min(maxQtd, 5),
      forceNiceScale: false,
    },
    colors: ["#a6036d"],
  };

  const graphFatOptions = {
    chart: {
      id: "vendas-line",
      toolbar: { show: false },
    },
    title: {
      text: "Crescimento R$ Mensal",
      align: "left" as const,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Nunito, Arial, sans-serif",
        color: "#a6036d",
      },
    },
    xaxis: { categories: mesesDinamicos },
    yaxis: {
      min: 0,
      max: maxFat,
      tickAmount: Math.min(maxFat, 5),
      forceNiceScale: false,
    },
    colors: ["#a6036d"],
    tooltip: {
      y: {
        formatter: (val: number) =>
          "R$ " + val.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-white-default gap-2">
      <section className="flex flex-col gap-2 p-4 w-full h-full">
        <Header title="Geral" subtitle="Relatórios" backRouter="/" />

        <div className="flex gap-2 w-full h-1/6">
          <div className="bg-white shadow-lg w-full h-full rounded-lg p-2 flex flex-col justify-between">
            <h3 className="text-xs text-left">Vendas R$ Mensal</h3>
            <div className="flex-1 flex items-center justify-center">
              <h2 className="font-bold text-2xl text-center">
                R${" "}
                {Number(kpiVendas).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
          </div>

          <div className="bg-white shadow-lg w-full h-full rounded-lg p-2 g-0.5">
            <h3 className="text-xs">Top 3 Produtos</h3>
            {kpiTop3Produtos.map((produto, idx) => (
              <div className="font-bold text-sm" key={produto.id}>
                {idx + 1}. {produto.nome}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full h-full gap-2">
          <div className="bg-white rounded-lg shadow-lg p-2 h-full">
            <ApexCharts
              options={graphQtdOptions}
              series={graphQtdSeries}
              type="bar"
              title="Qtd. Vendas Mensais"
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-2 h-ful">
            <ApexCharts
              options={graphFatOptions}
              series={graphFatSeries}
              type="line"
              title="Crescimento R$ Mensal"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
