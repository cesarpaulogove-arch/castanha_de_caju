
import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'
import ModuloProdutores from '../components/gestao/ModuloProdutores'
import ModuloClientes from '../components/gestao/ModuloClientes'
import ModuloEntregadores from '../components/gestao/ModuloEntregadores'
import ModuloFornecedores from '../components/gestao/ModuloFornecedores'
import ModuloProcessadores from '../components/gestao/ModuloProcessadores'
import ModuloTransportadores from '../components/gestao/ModuloTransportadores'
import ModuloStocks from '../components/gestao/ModuloStocks'



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

  if (sessao.tipo !== 'GESTOR') {
    return false
  }

  const gestorEmail = process.env.GESTOR_EMAIL
    ?.trim()
    .toLowerCase()

  if (!gestorEmail) {
    return false
  }

  return true
}

const [ stocks, movimentosStock, ] = await Promise.all([ prisma.stock.findMany(), prisma.movimentoStock.count(), ])

const quantidadeStock = stocks.reduce( (total, stock) => total + Number(stock.quantidade), 0 )


export default async function GestaoPage() {
  const autenticado = await verificarGestor()

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-[#fff8e8] px-6 py-16">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-[#eadbc4] bg-white p-8 text-center shadow-[0_20px_60px_rgba(92,64,32,0.10)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <LayoutDashboard
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
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#166534] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#14532d]"
            >
              Entrar na conta
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff8e8]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* CABEÇALHO */}
        <header className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#166534] shadow-sm">
                  <LayoutDashboard
                    size={24}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a58b6d]">
                    Área administrativa
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-[#382515]">
                    Gestão
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#806b55]">
                Painel central para acompanhar os
                utilizadores, operações, stocks e
                vendas da plataforma.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-[#dfceb4] bg-white px-5 py-3 text-sm font-bold text-[#5c4732] shadow-sm transition hover:border-[#166534] hover:text-[#166534]"
            >
              <ArrowLeft size={18} />
              Voltar ao início
            </Link>
          </div>
        </header>

        {/* MÓDULOS */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#382515]">
              Módulos de gestão
            </h2>

            <p className="mt-1 text-sm text-[#806b55]">
              Consulte e administre os dados reais
              armazenados na plataforma.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <ModuloProdutores />

            <ModuloClientes />

            <ModuloEntregadores />

            <ModuloFornecedores />

            <ModuloProcessadores />

            <ModuloTransportadores />

            <ModuloStocks produtos={stocks.length} quantidade={quantidadeStock} movimentos={movimentosStock} />

          </div>
        </section>
      </div>
    </main>
  )
}

