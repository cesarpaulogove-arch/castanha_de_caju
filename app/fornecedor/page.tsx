
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { obterFornecedorAutenticado } from '@/lib/auth-user'

export const dynamic = 'force-dynamic'

export default async function FornecedorPage() {
  const fornecedor =
    await obterFornecedorAutenticado()

  if (!fornecedor) {
    redirect('/signin')
  }

  const fornecimentos =
    await prisma.fornecimento.findMany({
      where: {
        fornecedorId: fornecedor.id,
      },
      include: {
        produto: true,
      },
      orderBy: {
        dataFornecimento: 'desc',
      },
    })

  const totalFornecido =
    fornecimentos.reduce(
      (total, item) =>
        total + Number(item.quantidade),
      0
    )

  const totalDisponivel =
    fornecimentos.reduce(
      (total, item) =>
        total +
        Number(
          item.quantidadeDisponivel
        ),
      0
    )

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-8 text-[#382515]">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold text-green-700">
              Área do Fornecedor
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Olá, {fornecedor.nome}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Controle os produtos e quantidades
              que fornece à plataforma.
            </p>
          </div>

          <Link
            href="/fornecedor/fornecimento"
            className="rounded-2xl bg-green-700 px-5 py-3 text-center font-bold text-white transition hover:bg-green-800"
          >
            + Registar fornecimento
          </Link>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Fornecimentos
            </p>

            <p className="mt-2 text-3xl font-bold">
              {fornecimentos.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total fornecido
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalFornecido.toLocaleString(
                'pt-MZ',
                {
                  maximumFractionDigits: 3,
                }
              )}{' '}
              kg
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Disponível
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {totalDisponivel.toLocaleString(
                'pt-MZ',
                {
                  maximumFractionDigits: 3,
                }
              )}{' '}
              kg
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-xl font-bold">
              Meus fornecimentos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Produtos fornecidos por si.
            </p>
          </div>

          {fornecimentos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="font-semibold">
                Ainda não existem fornecimentos.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Registe o primeiro fornecimento
                para começar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-3">
                      Lote
                    </th>

                    <th className="px-4 py-3">
                      Produto
                    </th>

                    <th className="px-4 py-3">
                      Quantidade
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
                  {fornecimentos.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-4 font-semibold">
                          {item.lote}
                        </td>

                        <td className="px-4 py-4">
                          {item.produto.nome}
                        </td>

                        <td className="px-4 py-4">
                          {Number(
                            item.quantidade
                          ).toLocaleString(
                            'pt-MZ'
                          )}{' '}
                          kg
                        </td>

                        <td className="px-4 py-4 font-semibold text-green-700">
                          {Number(
                            item.quantidadeDisponivel
                          ).toLocaleString(
                            'pt-MZ'
                          )}{' '}
                          kg
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(
                            item.dataFornecimento
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

