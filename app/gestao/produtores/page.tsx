
import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Package,
  Scale,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE, gerarHashToken } from '@/lib/auth-session'

export const dynamic = 'force-dynamic'

async function verificarGestor() {
  const cookieStore = await cookies()

  const token = cookieStore.get(
    SESSION_COOKIE
  )?.value

  if (!token) {
    return false
  }

  const tokenHash = gerarHashToken(token)

  const sessao = await prisma.sessao.findUnique({
    where: {
      tokenHash,
    },
  })

  if (!sessao) {
    return false
  }

  if (sessao.expiraEm <= new Date()) {
    await prisma.sessao.delete({
      where: {
        id: sessao.id,
      },
    })

    return false
  }

  return sessao.tipo === 'GESTOR'
}

export default async function ProdutoresPage() {
  const autenticado = await verificarGestor()

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-[#fff8e8] px-6 py-16">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-[#eadbc4] bg-white p-8 text-center shadow-[0_20px_60px_rgba(92,64,32,0.10)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <ShieldCheck
                size={30}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-[#382515]">
              Acesso restrito
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#806b55]">
              Esta área está disponível apenas para
              o gestor autenticado.
            </p>

            <Link
              href="/signin"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#166534] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#14532d]"
            >
              Entrar na conta
            </Link>

          </div>
        </div>
      </main>
    )
  }

  const produtores = await prisma.usuario.findMany({
    where: {
      perfil: 'PRODUTOR',
    },

    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      localizacao: true,
      ativo: true,
      createdAt: true,

      producoes: {
        select: {
          id: true,
          lote: true,
          quantidade: true,
          quantidadeDisponivel: true,
          estado: true,
          dataProducao: true,

          produto: {
            select: {
              id: true,
              nome: true,
              unidade: true,
            },
          },
        },

        orderBy: {
          dataProducao: 'desc',
        },
      },
    },
  })

  const produtoresComResumo =
    produtores.map((produtor) => {
      const totalRegistado =
        produtor.producoes.reduce(
          (total, producao) =>
            total + Number(producao.quantidade),
          0
        )

      const totalConfirmado =
        produtor.producoes
          .filter(
            (producao) =>
              producao.estado === 'CONFIRMADO'
          )
          .reduce(
            (total, producao) =>
              total + Number(producao.quantidade),
            0
          )

      const totalPendente =
        produtor.producoes
          .filter(
            (producao) =>
              producao.estado === 'PENDENTE'
          )
          .reduce(
            (total, producao) =>
              total + Number(producao.quantidade),
            0
          )

      const totalDisponivel =
        produtor.producoes
          .filter(
            (producao) =>
              producao.estado === 'CONFIRMADO'
          )
          .reduce(
            (total, producao) =>
              total +
              Number(
                producao.quantidadeDisponivel
              ),
            0
          )

      const ultimaProducao =
        produtor.producoes[0] ?? null

      return {
        ...produtor,
        totalRegistado,
        totalConfirmado,
        totalPendente,
        totalDisponivel,
        ultimaProducao,
      }
    })

  const totalProdutores =
    produtoresComResumo.length

  const totalRegistadoGeral =
    produtoresComResumo.reduce(
      (total, produtor) =>
        total + produtor.totalRegistado,
      0
    )

  const totalConfirmadoGeral =
    produtoresComResumo.reduce(
      (total, produtor) =>
        total + produtor.totalConfirmado,
      0
    )

  const totalPendenteGeral =
    produtoresComResumo.reduce(
      (total, produtor) =>
        total + produtor.totalPendente,
      0
    )

  return (
    <main className="min-h-screen bg-[#fff8e8]">

      <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">

        {/* CABEÇALHO */}

        <header className="mb-8">

          <Link
            href="/gestao"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition hover:text-[#14532d]"
          >
            <ArrowLeft size={18} />
            Voltar à gestão
          </Link>

          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                  <UserRound
                    size={25}
                    className="text-[#166534]"
                  />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a58b6d]">
                    Gestão
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-[#382515]">
                    Produtores
                  </h1>

                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-[#806b55]">
                Acompanhe os produtores, as suas
                produções, quantidades e estado de
                confirmação.
              </p>

            </div>

            {/* RESUMO */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-2xl border border-[#e7d5b8] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#a58b6d]">
                  Produtores
                </p>

                <p className="mt-1 text-2xl font-black text-[#166534]">
                  {totalProdutores}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e7d5b8] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#a58b6d]">
                  Registado
                </p>

                <p className="mt-1 text-2xl font-black text-[#382515]">
                  {totalRegistadoGeral.toFixed(3)}
                  <span className="ml-1 text-xs font-bold">
                    kg
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-[#e7d5b8] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#a58b6d]">
                  Confirmado
                </p>

                <p className="mt-1 text-2xl font-black text-green-700">
                  {totalConfirmadoGeral.toFixed(3)}
                  <span className="ml-1 text-xs font-bold">
                    kg
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-[#e7d5b8] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#a58b6d]">
                  Pendente
                </p>

                <p className="mt-1 text-2xl font-black text-orange-600">
                  {totalPendenteGeral.toFixed(3)}
                  <span className="ml-1 text-xs font-bold">
                    kg
                  </span>
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* LISTA */}

        <section>

          {produtoresComResumo.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-[#dfceb4] bg-white p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f0e3]">
                <UserRound
                  size={28}
                  className="text-[#a58b6d]"
                />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-[#382515]">
                Nenhum produtor cadastrado
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806b55]">
                Quando um utilizador criar uma conta
                com o perfil de produtor, ele aparecerá
                automaticamente nesta área.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-[#e7d5b8] bg-white shadow-[0_10px_35px_rgba(92,64,32,0.07)]">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1450px] border-collapse">

                  <thead>

                    <tr className="border-b border-[#eadbc4] bg-[#fffaf1]">

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Produtor
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Contacto
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Produções
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Registado
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Confirmado
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Pendente
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Disponível
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Última atividade
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Estado
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {produtoresComResumo.map(
                      (produtor) => (

                        <tr
                          key={produtor.id}
                          className="border-b border-[#f1e8da] last:border-b-0 transition hover:bg-[#fffaf1]"
                        >

                          {/* PRODUTOR */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                                <UserRound
                                  size={20}
                                  className="text-[#166534]"
                                />
                              </div>

                              <div>

                                <p className="font-extrabold text-[#382515]">
                                  {produtor.nome}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#806b55]">
                                  <Mail size={13} />
                                  <span>
                                    {produtor.email}
                                  </span>
                                </div>

                              </div>

                            </div>

                          </td>

                          {/* CONTACTO */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-sm text-[#5c4732]">
                              <Phone size={16} />
                              <span>
                                {produtor.telefone ||
                                  'Não informado'}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-xs text-[#806b55]">
                              <MapPin size={14} />
                              <span>
                                {produtor.localizacao}
                              </span>
                            </div>

                          </td>

                          {/* NÚMERO DE PRODUÇÕES */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2">
                              <Package
                                size={17}
                                className="text-[#166534]"
                              />

                              <span className="font-bold text-[#382515]">
                                {
                                  produtor
                                    .producoes
                                    .length
                                }
                              </span>
                            </div>

                          </td>

                          {/* TOTAL REGISTADO */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2">
                              <Scale
                                size={17}
                                className="text-[#806b55]"
                              />

                              <span className="font-bold text-[#382515]">
                                {produtor.totalRegistado.toFixed(
                                  3
                                )}{' '}
                                kg
                              </span>
                            </div>

                          </td>

                          {/* CONFIRMADO */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2
                                size={17}
                              />

                              <span className="font-bold">
                                {produtor.totalConfirmado.toFixed(
                                  3
                                )}{' '}
                                kg
                              </span>
                            </div>

                          </td>

                          {/* PENDENTE */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-orange-600">
                              <AlertCircle
                                size={17}
                              />

                              <span className="font-bold">
                                {produtor.totalPendente.toFixed(
                                  3
                                )}{' '}
                                kg
                              </span>
                            </div>

                          </td>

                          {/* DISPONÍVEL */}

                          <td className="px-5 py-5">

                            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                              {produtor.totalDisponivel.toFixed(
                                3
                              )}{' '}
                              kg
                            </span>

                          </td>

                          {/* ÚLTIMA ATIVIDADE */}

                          <td className="px-5 py-5">

                            {produtor.ultimaProducao ? (

                              <div>

                                <div className="flex items-center gap-2 text-sm font-bold text-[#382515]">
                                  <Clock3
                                    size={15}
                                  />

                                  {
                                    produtor
                                      .ultimaProducao
                                      .produto
                                      .nome
                                  }
                                </div>

                                <p className="mt-1 text-xs text-[#806b55]">
                                  Lote:{' '}
                                  {
                                    produtor
                                      .ultimaProducao
                                      .lote
                                  }
                                </p>

                                <p className="text-xs text-[#806b55]">
                                  {new Intl.DateTimeFormat(
                                    'pt-MZ'
                                  ).format(
                                    produtor
                                      .ultimaProducao
                                      .dataProducao
                                  )}
                                </p>

                              </div>

                            ) : (

                              <span className="text-xs text-[#a58b6d]">
                                Sem produção
                              </span>

                            )}

                          </td>

                          {/* ESTADO */}

                          <td className="px-5 py-5">

                            {produtor.ativo ? (

                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                                Ativo
                              </span>

                            ) : (

                              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                                Desativado
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

      </div>

    </main>
  )
}

