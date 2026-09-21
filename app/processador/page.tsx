
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { obterProcessadorAutenticado } from '@/lib/auth-user'

export const dynamic = 'force-dynamic'

export default async function ProcessadorPage() {
  const processador =
    await obterProcessadorAutenticado()

  if (!processador) {
    redirect('/registo/processador/entrar')
  }

  const processamentos =
    await prisma.processamento.findMany({
      where: {
        processadorId: processador.id,
      },
      include: {
        produto: true,
      },
      orderBy: {
        dataProcessamento: 'desc',
      },
    })

  const totalProcessamentos =
    processamentos.length

  const totalProcessado =
    processamentos.reduce(
      (total, item) =>
        total + Number(item.quantidade),
      0
    )

  const totalDisponivel =
    processamentos.reduce(
      (total, item) =>
        total + Number(item.quantidadeDisponivel),
      0
    )

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-sm font-medium text-orange-600">
            Área do Processador
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Olá, {processador.nome}
          </h1>

          <p className="mt-2 text-slate-600">
            Controle os produtos e quantidades que
            você processou.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Processamentos
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalProcessamentos}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Total processado
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalProcessado.toFixed(3)} kg
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">
              Disponível
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {totalDisponivel.toFixed(3)} kg
            </p>
          </div>

        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/processador/processamento"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Registar processamento
          </Link>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Meus processamentos
            </h2>
          </div>

          {processamentos.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">
                Ainda não existem processamentos registados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-500">
                    <th className="px-6 py-4 font-medium">
                      Lote
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Produto
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Quantidade
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Disponível
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Data
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {processamentos.map(
                    (processamento) => (
                      <tr
                        key={processamento.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {processamento.lote}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {processamento.produto.nome}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {Number(
                            processamento.quantidade
                          ).toFixed(3)}{' '}
                          kg
                        </td>

                        <td className="px-6 py-4 font-medium text-emerald-600">
                          {Number(
                            processamento.quantidadeDisponivel
                          ).toFixed(3)}{' '}
                          kg
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {new Date(
                            processamento.dataProcessamento
                          ).toLocaleDateString(
                            'pt-MZ'
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

        </section>
      </div>
    </main>
  )
}
