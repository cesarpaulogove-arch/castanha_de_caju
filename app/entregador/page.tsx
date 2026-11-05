
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { obterEntregadorAutenticado } from '@/lib/auth-user'
import AtualizarLocalizacao from '../components/entregador/AtualizarLocalizacao'


export const dynamic = 'force-dynamic'

export default async function EntregadorPage() {
  const entregador = await obterEntregadorAutenticado()

  if (!entregador) {
    redirect('/registo/entregador/entrar')
  }

  // Alterar disponibilidade do entregador
  async function alternarDisponibilidade() {
    'use server'

    const utilizador = await obterEntregadorAutenticado()

    if (!utilizador) {
      redirect('/registo/entregador/entrar')
    }

    await prisma.usuario.update({
      where: {
        id: utilizador.id,
      },
      data: {
        online: !utilizador.online,
      },
    })

    revalidatePath('/entregador')
  }

  // Buscar compras atribuídas ao entregador
  const compras = await prisma.compra.findMany({
    where: {
      entregadorId: entregador.id,
    },
    orderBy: {
      dataCompra: 'desc',
    },
  })

  // Indicadores
  const totalEntregas = compras.length

  const entregasConcluidas = compras.filter(
    (compra) => compra.estado === 'ENTREGUE'
  ).length

  const entregasPendentes = compras.filter(
    (compra) => compra.estado === 'PENDENTE'
  ).length

  const entregasEmAndamento = compras.filter(
    (compra) =>
      compra.estado === 'EM_PREPARACAO' ||
      compra.estado === 'EM_ENTREGA'
  ).length

  const totalKg = compras.reduce(
    (total, compra) =>
      total + Number(compra.quantidadeTotalKg),
    0
  )

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-8 text-[#382515]">
      <div className="mx-auto max-w-7xl">

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-green-700">
              Área do Entregador
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Olá, {entregador.nome}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Acompanhe as suas entregas e a sua actividade na plataforma.
            </p>

            {/* Disponibilidade */}
            <div className="mt-5 flex flex-wrap items-center gap-3">

              {entregador.online ? (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  ● ONLINE
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
                  ● OFFLINE
                </span>
              )}
              <AtualizarLocalizacao online={entregador.online} />

              <form action={alternarDisponibilidade}>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${
                    entregador.online
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-700 hover:bg-green-800'
                  }`}
                >
                  {entregador.online
                    ? 'Ficar OFFLINE'
                    : 'Ficar ONLINE'}
                </button>
              </form>

            </div>

            <p className="mt-3 text-xs text-gray-500">
              {entregador.online
                ? 'Está disponível para receber atribuições de entrega.'
                : 'Está indisponível para novas atribuições de entrega.'}
            </p>
          </div>

          <Link
            href="/entregador/entregas"
            className="rounded-2xl bg-green-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Consultar entregas
          </Link>

        </div>

        {/* Indicadores */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total de entregas
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalEntregas}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Entregas pendentes
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {entregasPendentes}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Em andamento
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {entregasEmAndamento}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Quantidade transportada
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalKg.toLocaleString('pt-MZ', {
                maximumFractionDigits: 3,
              })} kg
            </p>
          </div>

        </div>

        {/* Histórico */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold">
                As minhas entregas
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Histórico das compras atribuídas à sua conta.
              </p>
            </div>

            <Link
              href="/entregador/entregas"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Ver todas
            </Link>

          </div>

          {compras.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">

              <p className="font-semibold">
                Ainda não existem entregas atribuídas.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Quando uma compra lhe for atribuída,
                aparecerá nesta área.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-3">Referência</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Destino</th>
                    <th className="px-4 py-3">Quantidade</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Data</th>
                  </tr>
                </thead>

                <tbody>
                  {compras.map((compra) => (
                    <tr
                      key={compra.id}
                      className="border-b last:border-0"
                    >

                      <td className="px-4 py-4 font-semibold">
                        #{compra.id}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {compra.nomeCliente}
                        </div>

                        <div className="text-xs text-gray-500">
                          {compra.telefoneCliente}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          {compra.bairroEntrega || 'Não indicado'}
                        </div>

                        <div className="text-xs text-gray-500">
                          {compra.distritoEntrega || ''}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {Number(compra.quantidadeTotalKg).toLocaleString(
                          'pt-MZ',
                          { maximumFractionDigits: 3 }
                        )} kg
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            compra.estado === 'ENTREGUE'
                              ? 'bg-green-100 text-green-700'
                              : compra.estado === 'CANCELADA'
                                ? 'bg-red-100 text-red-700'
                                : compra.estado === 'EM_ENTREGA'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {compra.estado.replaceAll('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(compra.dataCompra).toLocaleDateString(
                          'pt-MZ'
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* Acesso rápido */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">

          <Link
            href="/entregador/entregas"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-bold">
              Gerir entregas
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Consulte as compras atribuídas e acompanhe
              as operações de entrega.
            </p>

            <p className="mt-4 font-semibold text-green-700">
              Aceder →
            </p>
          </Link>

          <Link
            href="/entregador/perfil"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-bold">
              Meu perfil
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Consulte os seus dados e informações
              da conta de entregador.
            </p>

            <p className="mt-4 font-semibold text-green-700">
              Aceder →
            </p>
          </Link>

        </section>

      </div>
    </main>
  )
}
