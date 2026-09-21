
import Link from 'next/link'
import { cookies } from 'next/headers'
import {
  ArrowLeft,
  Truck,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

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

  return true
}

export default async function EntregadoresPage() {
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

  const entregadores = await prisma.usuario.findMany({
    where: {
      perfil: 'ENTREGADOR',
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
    },
  })

  return (
    <main className="min-h-screen bg-[#fff8e8]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* CABEÇALHO */}
        <header className="mb-8">
          <Link
            href="/gestao"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition hover:text-[#14532d]"
          >
            <ArrowLeft size={18} />
            Voltar à gestão
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                  <Truck
                    size={25}
                    className="text-[#166534]"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a58b6d]">
                    Gestão
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-[#382515]">
                    Entregadores
                  </h1>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#806b55]">
                Consulte os entregadores cadastrados
                na plataforma.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e7d5b8] bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-[#a58b6d]">
                Total
              </p>

              <p className="mt-1 text-2xl font-black text-[#166534]">
                {entregadores.length}
              </p>
            </div>
          </div>
        </header>

        {/* LISTA */}
        <section>
          {entregadores.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dfceb4] bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f0e3]">
                <Truck
                  size={28}
                  className="text-[#a58b6d]"
                />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-[#382515]">
                Nenhum entregador cadastrado
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806b55]">
                Quando um utilizador criar uma conta
                com o perfil de entregador, ele aparecerá
                automaticamente nesta área.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[#e7d5b8] bg-white shadow-[0_10px_35px_rgba(92,64,32,0.07)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#eadbc4] bg-[#fffaf1]">
                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Entregador
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Contacto
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Localização
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-[#806b55]">
                        Cadastro
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {entregadores.map((entregador) => (
                      <tr
                        key={entregador.id}
                        className="border-b border-[#f1e8da] last:border-b-0 transition hover:bg-[#fffaf1]"
                      >
                        {/* ENTREGADOR */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                              <Truck
                                size={20}
                                className="text-[#166534]"
                              />
                            </div>

                            <div>
                              <p className="font-extrabold text-[#382515]">
                                {entregador.nome}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#806b55]">
                                <Mail size={13} />

                                <span>
                                  {entregador.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CONTACTO */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-[#5c4732]">
                            <Phone size={16} />

                            <span>
                              {entregador.telefone ||
                                'Não informado'}
                            </span>
                          </div>
                        </td>

                        {/* LOCALIZAÇÃO */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-[#5c4732]">
                            <MapPin size={16} />

                            <span>
                              {entregador.localizacao}
                            </span>
                          </div>
                        </td>

                        {/* ESTADO */}
                        <td className="px-6 py-5">
                          {entregador.ativo ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Desativado
                            </span>
                          )}
                        </td>

                        {/* DATA */}
                        <td className="px-6 py-5 text-sm text-[#806b55]">
                          {new Intl.DateTimeFormat(
                            'pt-MZ',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          ).format(entregador.createdAt)}
                        </td>
                      </tr>
                    ))}
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

