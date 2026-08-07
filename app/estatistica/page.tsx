'use client'
import { useState } from 'react'
// 🚀 ADICIONA "Coins" DENTRO DAS CHAVETAS NO TOPO DO FICHEIRO:
import { BarChart3, Cpu, TrendingUp, Users, MapPin, Layers, ArrowUpRight, Coins } from 'lucide-react'


export default function EstatisticasEmpresa() {
  // Estado para simular filtros de ano
  const [anoFiltro, setAnoFiltro] = useState<'todos' | '2025' | '2026'>('todos')

  // Dados consolidados de faturamento simulado
  const kpis = {
    faturamentoTotal: 73385.51,
    totalPedidos: 10,
    pesoEntregue: "135.0 KG",
    mediaPorPedido: 7338.55
  }

  // Dados de vendas por Distrito para o gráfico de barras verticais
  const dadosDistritos = [
    { distrito: 'KaMpfumo', vendas: 34072.00, percentagem: 100 },
    { distrito: 'Matola-Sede', vendas: 2638.50, percentagem: 8 },
    { distrito: 'KaMaxakeni', vendas: 7036.00, percentagem: 21 },
    { distrito: 'KaMavota', vendas: 7391.40, percentagem: 22 },
    { distrito: 'Infulene', vendas: 3518.00, percentagem: 10 },
    { distrito: 'Marracuene', vendas: 527.70, percentagem: 2 }
  ]

  // Desempenho Logístico das Entregadoras para o gráfico de barras horizontais
  const dadosEntregadoras = [
    { nome: 'Ana Paulo Gove', pedidos: 5, faturamento: 15352.65, percentagem: 31 },
    { nome: 'Joana Paulo Gove', pedidos: 5, faturamento: 58032.86, percentagem: 100 }
  ]

  // Função idêntica para manter os dois separadores corretos (2.300,00)
  const formataPreco = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
  }

  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white p-4 flex flex-col justify-start items-center select-none overflow-y-auto pt-4 pb-12">
      
      {/* PAINEL CENTRAL DE BUSINESS INTELLIGENCE */}
      <div className="w-full max-w-5xl bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase text-white">Métricas de Desempenho</h2>
              <p className="text-xs text-gray-400 mt-0.5">Mapeamento Visual Computacional • Gráficos de Vendas</p>
            </div>
          </div>

          {/* Filtros de Cronologia */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold text-gray-400">
            {(['todos', '2025', '2026'] as const).map((ano) => (
              <button
                key={ano}
                onClick={() => setAnoFiltro(ano)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  anoFiltro === ano ? 'bg-amber-500 text-black font-black shadow' : 'hover:text-white'
                }`}
              >
                {ano === 'todos' ? 'Histórico Geral' : ano}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 GRID 1: QUADROS DE VALORES (KPIS DIGITAIS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-1.5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Faturamento</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-amber-500 tracking-wide">
              {formataPreco(kpis.faturamentoTotal)} <span className="text-xs text-white">MT</span>
            </p>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +14.2% este mês
            </span>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Fluxo Logístico</span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-xl font-black text-white tracking-tight">
              {kpis.totalPedidos} <span className="text-xs text-gray-400 font-bold">Ordens</span>
            </p>
            <span className="text-[10px] font-bold text-gray-500">Mapeamento em Maputo/Matola</span>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Massa de Carga</span>
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-black text-white tracking-tight">
              {kpis.pesoEntregue}
            </p>
            <span className="text-[10px] font-bold text-[#D4FF21]/70 uppercase tracking-wider">
              Despacho Premium Total
            </span>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Ticket Médio</span>
              <Coins className="w-3.5 h-3.5 text-amber-500" /> 
            </div>
            <p className="text-xl font-black text-amber-500 tracking-wide">
              {formataPreco(kpis.mediaPorPedido)} <span className="text-xs text-white">MT</span>
            </p>
            <span className="text-[10px] font-bold text-gray-500">Valor médio por transação</span>
          </div>

        </div>

        {/* 📊 GRID 2: GRÁFICOS ILUSTRATIVOS NATIVOS EM PROPORÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* GRÁFICO 1 (COLUNA DA ESQUERDA - 2 SPANS): BARRAS VERTICAIS POR DISTRITO */}
          <div className="lg:col-span-2 bg-black/20 border border-white/5 rounded-xl p-5 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> Distribuição Financeira por Distrito
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">Análise volumétrica baseada na morada de despacho do cliente.</p>
            </div>

            {/* Contentor do Gráfico de Barras */}
            <div className="h-44 w-full flex items-end justify-between px-2 pt-4 border-b border-white/10 relative gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
              {dadosDistritos.map((item) => (
                <div key={item.distrito} className="flex-1 flex flex-col items-center gap-2 group min-w-[50px] shrink-0">
                  {/* Tooltip com valor real */}
                  <span className="opacity-0 group-hover:opacity-100 absolute bg-black border border-white/10 text-[9px] font-black text-amber-500 px-1.5 py-0.5 rounded-md -translate-y-14 transition-opacity shadow-xl z-30">
                    {formataPreco(item.vendas)} MT
                  </span>
                  
                  {/* A Barra Dinâmica */}
                  <div 
                    style={{ height: `${item.percentagem}%` }}
                    className="w-full max-w-[28px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md border-t border-white/20 transition-all duration-1000 group-hover:from-amber-500 group-hover:to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] cursor-pointer"
                  />
                  
                  {/* Rótulo */}
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight truncate max-w-full text-center">
                    {item.distrito}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GRÁFICO 2 (COLUNA DA DIREITA - 1 SPAN): BARRAS HORIZONTAIS DE PRODUTIVIDADE DE AGENTES */}
          <div className="lg:col-span-1 bg-black/20 border border-white/5 rounded-xl p-5 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> Produtividade Logística
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">Monitorização de faturamento gerido pelas vossas agentes oficiais.</p>
            </div>

            {/* Listagem em Barra Horizontal */}
            <div className="space-y-4 py-2 flex-1 flex flex-col justify-center">
              {dadosEntregadoras.map((agente) => (
                <div key={agente.nome} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-black text-white">{agente.nome}</span>
                    <span className="font-bold text-amber-500">{agente.pedidos} Entregas</span>
                  </div>
                  
                  {/* Linha de Progresso Nata */}
                  <div className="w-full bg-black/50 h-2.5 rounded-full border border-white/5 overflow-hidden">
                    <div 
                      style={{ width: `${agente.percentagem}%` }}
                      className="bg-[#009966] h-full rounded-full transition-all duration-1000 border-r border-white/20 shadow-[0_0_10px_rgba(0,153,102,0.2)]"
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                    <span>Despacho Concluído</span>
                    <span className="text-gray-300">{formataPreco(agente.faturamento)} MT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* NOTA OPERACIONAL COMPUTAÇÃO GRÁFICA */}
        <div className="text-[10px] text-gray-600 text-center pt-2">
          Gráficos analíticos estruturados em tempo real. Os dados agregam as reduções automáticas de grossista (5%) aplicadas aos lotes superiores a 10 unidades.
        </div>

      </div>
    </div>
  )
}
