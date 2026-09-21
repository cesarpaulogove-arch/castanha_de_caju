
import { cookies } from 'next/headers'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

import {
  ArrowLeft,
  Boxes,
  Package,
  TrendingDown,
  TrendingUp,
  History,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function formatarNumero(valor: number) {
  return new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(valor)
}

function formatarData(data: Date) {
  return new Intl.DateTimeFormat('pt-MZ', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data)
}

function nomeMovimento(tipo: string) {
  switch (tipo) {
    case 'ENTRADA_PRODUCAO':
      return 'Produção'

    case 'ENTRADA_FORNECIMENTO':
      return 'Fornecimento'

    case 'ENTRADA_PROCESSAMENTO':
      return 'Processamento'

    case 'SAIDA':
      return 'Saída'

    case 'AJUSTE':
      return 'Ajuste'

    default:
      return tipo
  }
}

function classeMovimento(tipo: string) {
  switch (tipo) {
    case 'SAIDA':
      return 'bg-red-50 text-red-700'

    case 'AJUSTE':
      return 'bg-amber-50 text-amber-700'

    default:
      return 'bg-emerald-50 text-emerald-700'
  }
}

export default async function GestaoStocksPage() {
  // =========================================================
  // 1. VALIDAR SESSÃO DO GESTOR
  // =========================================================

  const cookieStore = await cookies()

  const token =
    cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f8f6ef] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Acesso não autorizado
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            É necessário iniciar sessão como gestor.
          </p>

          <Link
            href="/registo"
            className="inline-flex mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800 transition"
          >
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  const tokenHash = gerarHashToken(token)

  const sessao = await prisma.sessao.findUnique({
    where: {
      tokenHash,
    },
  })

  if (
    !sessao ||
    sessao.expiraEm <= new Date() ||
    sessao.tipo !== 'GESTOR'
  ) {
    return (
      <div className="min-h-screen bg-[#f8f6ef] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Sessão inválida
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Inicie novamente a sessão de gestão.
          </p>

          <Link
            href="/registo"
            className="inline-flex mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800 transition"
          >
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  // =========================================================
  // 2. OBTER STOCK
  // =========================================================

  const stocks = await prisma.stock.findMany({
    include: {
      produto: true,
    },
    orderBy: {
      produto: {
        nome: 'asc',
      },
    },
  })

  // =========================================================
  // 3. OBTER MOVIMENTOS
  // =========================================================

  const movimentos =
    await prisma.movimentoStock.findMany({
      include: {
        produto: true,
        producao: {
          include: {
            produtor: true,
          },
        },
        fornecimento: {
          include: {
            fornecedor: true,
          },
        },
        processamento: {
          include: {
            processador: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

  // =========================================================
  // 4. TOTAIS
  // =========================================================

  const totalProdutos = stocks.length

  const stockTotal = stocks.reduce(
    (total, item) =>
      total + Number(item.quantidade),
    0
  )

  const totalEntradas = movimentos
    .filter(
      (movimento) =>
        movimento.tipo !== 'SAIDA'
    )
    .reduce(
      (total, movimento) =>
        total + Number(movimento.quantidade),
      0
    )

  const totalSaidas = movimentos
    .filter(
      (movimento) =>
        movimento.tipo === 'SAIDA'
    )
    .reduce(
      (total, movimento) =>
        total + Number(movimento.quantidade),
      0
    )

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-gray-900">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Boxes
                    size={22}
                    className="text-emerald-700"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Stock
                  </h1>

                  <p className="text-sm text-gray-500">
                    Gestão centralizada do stock
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/gestao"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={17} />
              Voltar à Gestão
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ===================================================
            RESUMO
        ==================================================== */}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Produtos */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Produtos em stock
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalProdutos}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package
                  size={21}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Stock total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Stock actual
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(stockTotal)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  kg
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Boxes
                  size={21}
                  className="text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Entradas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Entradas registadas
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(totalEntradas)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  kg
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <TrendingUp
                  size={21}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          {/* Saídas */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Saídas registadas
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {formatarNumero(totalSaidas)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  kg
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <TrendingDown
                  size={21}
                  className="text-red-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            STOCK ACTUAL
        ==================================================== */}

        <section className="mt-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">
                Stock actual
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Quantidade disponível por produto
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {stocks.length === 0 ? (
              <div className="p-10 text-center">
                <Boxes
                  size={35}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-700">
                  Ainda não existe stock.
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  O stock será criado quando uma operação for confirmada.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-4 text-left font-semibold">
                        Produto
                      </th>

                      <th className="px-5 py-4 text-left font-semibold">
                        Unidade
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Quantidade
                      </th>

                      <th className="px-5 py-4 text-left font-semibold">
                        Última actualização
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {stocks.map((stock) => (
                      <tr
                        key={stock.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">
                            {stock.produto.nome}
                          </div>

                          {stock.produto.descricao && (
                            <div className="text-xs text-gray-400 mt-1">
                              {stock.produto.descricao}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {stock.produto.unidade}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="font-bold text-gray-900">
                            {formatarNumero(
                              Number(stock.quantidade)
                            )}
                          </span>

                          <span className="ml-1 text-xs text-gray-400">
                            {stock.produto.unidade}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {formatarData(
                            stock.updatedAt
                          )}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            HISTÓRICO
        ==================================================== */}

        <section className="mt-8">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <History
                size={20}
                className="text-gray-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Histórico de movimentos
              </h2>

              <p className="text-sm text-gray-500">
                Registo das alterações efectuadas no stock
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {movimentos.length === 0 ? (
              <div className="p-10 text-center">
                <History
                  size={35}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-700">
                  Ainda não existem movimentos.
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  O histórico aparecerá depois das primeiras confirmações.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">

                      <th className="px-5 py-4 text-left font-semibold">
                        Data
                      </th>

                      <th className="px-5 py-4 text-left font-semibold">
                        Produto
                      </th>

                      <th className="px-5 py-4 text-left font-semibold">
                        Origem
                      </th>

                      <th className="px-5 py-4 text-left font-semibold">
                        Lote
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Quantidade
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Antes
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        Depois
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {movimentos.map((movimento) => {

                      let origem = '—'
                      let lote = '—'

                      if (movimento.producao) {
                        origem =
                          movimento.producao.produtor.nome

                        lote =
                          movimento.producao.lote
                      }

                      if (movimento.fornecimento) {
                        origem =
                          movimento.fornecimento.fornecedor.nome

                        lote =
                          movimento.fornecimento.lote
                      }

                      if (movimento.processamento) {
                        origem =
                          movimento.processamento.processador.nome

                        lote =
                          movimento.processamento.lote
                      }

                      return (
                        <tr
                          key={movimento.id}
                          className="hover:bg-gray-50 transition"
                        >

                          <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                            {formatarData(
                              movimento.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium">
                              {movimento.produto.nome}
                            </div>

                            <div
                              className={`inline-flex mt-1 rounded-full px-2 py-1 text-[11px] font-medium ${classeMovimento(
                                movimento.tipo
                              )}`}
                            >
                              {nomeMovimento(
                                movimento.tipo
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {origem}
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-mono text-xs bg-gray-100 rounded-md px-2 py-1">
                              {lote}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right font-semibold">
                            {formatarNumero(
                              Number(
                                movimento.quantidade
                              )
                            )}{' '}
                            kg
                          </td>

                          <td className="px-5 py-4 text-right text-gray-500">
                            {formatarNumero(
                              Number(
                                movimento.quantidadeAntes
                              )
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                            {formatarNumero(
                              Number(
                                movimento.quantidadeDepois
                              )
                            )}
                          </td>

                        </tr>
                      )
                    })}

                  </tbody>
                </table>

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  )
}

