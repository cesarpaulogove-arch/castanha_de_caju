
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProcessamentoPage() {
  const router = useRouter()

  const [produto, setProduto] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [data, setData] = useState(
    new Date().toISOString().split('T')[0]
  )

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      const resposta = await fetch(
        '/api/processador/processamento',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            produto,
            quantidade,
            data,
          }),
        }
      )

      const resultado = await resposta.json()

      if (!resposta.ok) {
        setErro(
          resultado?.mensagem ||
            'Não foi possível registar o processamento.'
        )
        return
      }

      setSucesso(
        'Processamento registado com sucesso.'
      )

      setProduto('')
      setQuantidade('')

      setTimeout(() => {
        router.push('/processador')
        router.refresh()
      }, 700)
    } catch {
      setErro(
        'Não foi possível comunicar com o servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/processador"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Voltar para o painel
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

          <div className="mb-8">
            <p className="text-sm font-medium text-orange-600">
              Processador
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Registar processamento
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Registe o produto e a quantidade processada.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label
                htmlFor="produto"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Produto
              </label>

              <input
                id="produto"
                type="text"
                value={produto}
                onChange={(event) =>
                  setProduto(event.target.value)
                }
                placeholder="Ex.: Castanha de caju"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Quantidade processada (kg)
              </label>

              <input
                id="quantidade"
                type="number"
                min="0.001"
                step="0.001"
                value={quantidade}
                onChange={(event) =>
                  setQuantidade(event.target.value)
                }
                placeholder="Ex.: 50"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="data"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Data do processamento
              </label>

              <input
                id="data"
                type="date"
                value={data}
                onChange={(event) =>
                  setData(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {erro && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {sucesso}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando
                ? 'A registar...'
                : 'Registar processamento'}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}

