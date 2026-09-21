
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
  Users,
  AlertTriangle,
  CheckCircle2,
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

function nomePerfil(perfil: string) {
  switch (perfil) {
    case 'PRODUTOR':
      return 'Produtores'
    case 'FORNECEDOR':
      return 'Fornecedores'
    case 'PROCESSADOR':
      return 'Processadores'
    default:
      return perfil
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
    return <AcessoNegado />
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
    return <AcessoNegado />
  }

  // =========================================================
  // 2. RECUPERAR DADOS DO BANCO DE DADOS
  // =========================================================

  const [
    stocks,
    movimentos,
    totalProdutores,
    totalFornecedores,
    totalProcessadores,
  ] = await Promise.all([
    prisma.stock.findMany({
      include: {
        produto: true,
      },
      orderBy: {
        produto: {
          nome: 'asc',
        },
      },
    }),

    prisma.movimentoStock.findMany({
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
    }),

    prisma.usuario.count({
      where: {
        perfil: 'PRODUTOR',
        ativo: true,
      },
    }),

    prisma.usuario.count({
      where: {
        perfil: 'FORNECEDOR',
        ativo: true,
      },
    }),

    prisma.usuario.count({
      where: {
        perfil: 'PROCESSADOR',
        ativo: true,
      },
    }),
  ])

  // =========================================================
  // 3. TOTAIS
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

  // =========================================================
  // 4. VERIFICAR EXISTÊNCIA DAS ORIGENS
  // =========================================================

  const movimentosSemOrigem = movimentos.filter(
    (movimento) => {
      if (
        movimento.tipo === 'ENTRADA_PRODUCAO'
      ) {
        return !movimento.producao?.produtor
      }

      if (
        movimento.tipo === 'ENTRADA_FORNECIMENTO'
      ) {
        return !movimento.fornecimento?.fornecedor
      }

      if (
        movimento.tipo === 'ENTRADA_PROCESSAMENTO'
      ) {
        return !movimento.processamento?.processador
      }

      return false
    }
  )

  // =========================================================
  // 5. RENDERIZAÇÃO
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-gray-900">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Boxes
                  size={22}
                  className="text-emerald-700"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Stock
                </h1>

                <p className="text-sm text-gray-500">
                  Gestão centralizada do stock
                </p>
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

      {/* CONTEÚDO */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* RESUMO */}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <ResumoCard
            titulo="Produtos em stock"
            valor={String(totalProdutos)}
            icone={
              <Package
                size={21}
                className="text-blue-600"
              />
            }
            fundo="bg-blue-50"
          />

          <ResumoCard
            titulo="Stock actual"
            valor={formatarNumero(stockTotal)}
            unidade="kg"
            icone={
              <Boxes
                size={21}
                className="text-emerald-600"
              />
            }
            fundo="bg-emerald-50"
          />

          <ResumoCard
            titulo="Entradas registadas"
            valor={formatarNumero(totalEntradas)}
            unidade="kg"
            icone={
              <TrendingUp
                size={21}
                className="text-green-600"
              />
            }
            fundo="bg-green-50"
          />

          <ResumoCard
            titulo="Saídas registadas"
            valor={formatarNumero(totalSaidas)}
            unidade="kg"
            icone={
              <TrendingDown
                size={21}
                className="text-red-600"
              />
            }
            fundo="bg-red-50"
          />

        </section>

        {/* EXISTÊNCIA DOS UTILIZADORES */}

        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Verificação de entidades
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Utilizadores registados na base de dados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <EntidadeCard
              titulo="Produtores"
              total={totalProdutores}
            />

            <EntidadeCard
              titulo="Fornecedores"
              total={totalFornecedores}
            />

            <EntidadeCard
              titulo="Processadores"
              total={totalProcessadores}
            />

          </div>

        </section>

        {/* VERIFICAÇÃO DE ORIGENS */}

        <section className="mt-8">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              {movimentosSemOrigem.length === 0 ? (
                <CheckCircle2
                  size={22}
                  className="text-emerald-600"
                />
              ) : (
                <AlertTriangle
                  size={22}
                  className="text-amber-600"
                />
              )}

              <div>
                <h2 className="font-bold">
                  Integridade das origens
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Verificação dos produtores,
                  fornecedores e processadores
                  associados aos movimentos.
                </p>
              </div>

            </div>

            {movimentosSemOrigem.length === 0 ? (
              <p className="mt-4 text-sm text-emerald-700">
                Todas as origens dos movimentos
                apresentados foram encontradas.
              </p>
            ) : (
              <p className="mt-4 text-sm text-amber-700">
                Foram encontrados{' '}
                {movimentosSemOrigem.length}{' '}
                movimentos sem a entidade de origem
                correspondente.
              </p>
            )}

            <p className="mt-2 text-xs text-gray-400">
              Verificação limitada aos últimos 100
              movimentos recuperados.
            </p>

          </div>

        </section>

        {/* STOCK ACTUAL */}

        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Stock actual
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Quantidade disponível por produto
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {stocks.length === 0 ? (
              <EstadoVazio
                icone={
                  <Boxes
                    size={35}
                    className="mx-auto text-gray-300"
                  />
                }
                mensagem="Ainda não existe stock."
                descricao="O stock será criado quando uma operação for confirmada."
              />
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
                          {formatarData(stock.updatedAt)}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

        {/* HISTÓRICO */}

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
                Últimos 100 movimentos registados
              </p>
            </div>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {movimentos.length === 0 ? (
              <EstadoVazio
                icone={
                  <History
                    size={35}
                    className="mx-auto text-gray-300"
                  />
                }
                mensagem="Ainda não existem movimentos."
                descricao="O histórico aparecerá depois das primeiras confirmações."
              />
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
                            {formatarData(movimento.createdAt)}
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
                              {nomeMovimento(movimento.tipo)}
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
                              Number(movimento.quantidade)
                            )}{' '}
                            kg
                          </td>

                          <td className="px-5 py-4 text-right text-gray-500">
                            {formatarNumero(
                              Number(movimento.quantidadeAntes)
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                            {formatarNumero(
                              Number(movimento.quantidadeDepois)
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

// =========================================================
// COMPONENTES AUXILIARES
// =========================================================

function AcessoNegado() {
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

function ResumoCard({
  titulo,
  valor,
  unidade,
  icone,
  fundo,
}: {
  titulo: string
  valor: string
  unidade?: string
  icone: React.ReactNode
  fundo: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {valor}
          </p>

          {unidade && (
            <p className="mt-1 text-xs text-gray-400">
              {unidade}
            </p>
          )}

        </div>

        <div className={`w-11 h-11 rounded-xl ${fundo} flex items-center justify-center`}>
          {icone}
        </div>

      </div>

    </div>
  )
}

function EntidadeCard({
  titulo,
  total,
}: {
  titulo: string
  total: number
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {total}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Registos activos
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Users
            size={21}
            className="text-emerald-600"
          />
        </div>

      </div>

    </div>
  )
}

function EstadoVazio({
  icone,
  mensagem,
  descricao,
}: {
  icone: React.ReactNode
  mensagem: string
  descricao: string
}) {
  return (
    <div className="p-10 text-center">

      {icone}

      <p className="mt-4 font-medium text-gray-700">
        {mensagem}
      </p>

      <p className="mt-1 text-sm text-gray-400">
        {descricao}
      </p>

    </div>
  )
}