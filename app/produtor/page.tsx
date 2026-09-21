
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { obterProdutorAutenticado } from '@/lib/auth-user'

export const dynamic = 'force-dynamic'

export default async function ProdutorPage() {
  const produtor = await obterProdutorAutenticado()

  if (!produtor) {
    redirect('/signin')
  }

  const producoes = await prisma.producao.findMany({
    where: {
      produtorId: produtor.id,
    },
    include: {
      produto: true,
    },
    orderBy: {
      dataProducao: 'desc',
    },
  })

  const totalProduzido = producoes.reduce(
    (total, producao) =>
      total + Number(producao.quantidade),
    0
  )

  const totalDisponivel = producoes.reduce(
    (total, producao) =>
      total + Number(producao.quantidadeDisponivel),
    0
  )

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-8 text-[#382515]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">
              Área do Produtor
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Olá, {produtor.nome}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Aqui pode controlar a sua produção,
              produtos e quantidades.
            </p>
          </div>

          <Link
            href="/produtor/producao"
            className="rounded-2xl bg-green-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            + Registar produção
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Produções
            </p>

            <p className="mt-2 text-3xl font-bold">
              {producoes.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total produzido
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalProduzido.toLocaleString('pt-MZ', {
                maximumFractionDigits: 3,
              })}{' '}
              kg
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Disponível
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {totalDisponivel.toLocaleString('pt-MZ', {
                maximumFractionDigits: 3,
              })}{' '}
              kg
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                A minha produção
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Todos os produtos produzidos por si.
              </p>
            </div>

            <Link
              href="/produtor/producao"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Nova produção
            </Link>
          </div>

          {producoes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="font-semibold">
                Ainda não existe produção registada.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Comece por registar o primeiro
                produto produzido.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">

                    <th className="px-4 py-3">
                      Lote
                    </th>

                    <th className="px-4 py-3">
                      Produto
                    </th>

                    <th className="px-4 py-3">
                      Produzido
                    </th>

                    <th className="px-4 py-3">
                      Disponível
                    </th>

                    <th className="px-4 py-3">
                      Data
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {producoes.map((producao) => (
                    <tr
                      key={producao.id}
                      className="border-b last:border-0"
                    >

                      <td className="px-4 py-4 font-semibold">
                        {producao.lote}
                      </td>

                      <td className="px-4 py-4">
                        {producao.produto.nome}
                      </td>

                      <td className="px-4 py-4">
                        {Number(
                          producao.quantidade
                        ).toLocaleString('pt-MZ', {
                          maximumFractionDigits: 3,
                        })}{' '}
                        kg
                      </td>

                      <td className="px-4 py-4 font-semibold text-green-700">
                        {Number(
                          producao.quantidadeDisponivel
                        ).toLocaleString('pt-MZ', {
                          maximumFractionDigits: 3,
                        })}{' '}
                        kg
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(
                          producao.dataProducao
                        ).toLocaleDateString('pt-MZ')}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </div>
    </main>
  )
}

