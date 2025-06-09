"use client";

import { useState, useEffect } from "react";

import ApexCharts from "react-apexcharts";

import Header from "@/components/header";
import {
  quantidadeProdutosUltimos6Meses,
  top3ProdutosMes,
  totalVendasMensal,
  valoresVendasUltimos6Meses,
} from "@/api/spring/services/RelatorioService";

function getLastMonths(qtd = 6) {
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const today = new Date();
  let mesesArr = [];
  for (let i = qtd - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    mesesArr.push(meses[d.getMonth()]);
  }
  return mesesArr;
}

export default function Dashboard() {
  const mesesDinamicos = getLastMonths(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // KPI Data
        const totalVendas = await totalVendasMensal();
        const top3Produtos = await top3ProdutosMes();
        // Graph Data
        const qtd6mes = await quantidadeProdutosUltimos6Meses();
        const val6meses = await valoresVendasUltimos6Meses();
      } catch (error) {
        console.error("Erro ao buscar dados de relatórios:", error);
      }
    };
    fetchData();
  }, []);

  const [series, setSeries] = useState([
    {
      name: "Vendas",
      data: [41, 35, 51, 49, 62, 69],
    },
  ]);

  const options = {
    chart: { id: "vendas-line" },
    xaxis: {
      categories: mesesDinamicos,
    },
    colors: ["#a6036d"],
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-white-default gap-2 p-4">
      <Header title="Geral" subtitle="Relatórios" backRouter="/"></Header>

      <div className="flex gap-2 w-full h-full">
        <div className="bg-white shadow-lg w-full h-full rounded-lg p-2">
          <h3 className="text-xs">Valor R$ Mensal</h3>
          <h2 className="font-bold">R$ 400</h2>
        </div>
        <div className="bg-white shadow-lg w-full h-full rounded-lg p-2">
          <h3 className="text-xs">Top 3 Produtos</h3>
          <h2 className="font-bold">R$ 400</h2>
        </div>
      </div>

      <div className="flex flex-col w-full h-full gap-2">
        <div className="bg-white rounded-lg shadow-lg p-2 h-full">
          <h3 className="text-xs font-extrabold">Qtd. Vendas Mensais</h3>
          <ApexCharts options={options} series={series} type="bar" />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-2 h-full">
          <h3 className="text-xs font-extrabold">Crescimento R$ Mensal</h3>
          <ApexCharts options={options} series={series} type="line" />
        </div>
      </div>
    </div>
  );
}
