
'use client'

import {
  FormEvent,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

export default function ProducaoPage() {
  const router = useRouter()

  const [produtoNome, setProdutoNome] =
    useState('')

  const [quantidade, setQuantidade] =
    useState('')

  const [dataProducao, setDataProducao] =
    useState('')

  const [carregando, setCarregando] =
    useState(false)

  const [mensagem, setMensagem] =
    useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setMensagem('')
    setCarregando(true)

    try {
      const resposta = await fetch(
        '/api/produtor/producao',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            produtoNome,
            quantidade,
            dataProducao,
          }),
        }
      )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        setMensagem(
          dados?.mensagem ||
            'Não foi possível registar a produção.'
        )
        return
      }

      router.push('/produtor')
      router.refresh()
    } catch (error) {
      console.error(
        'ERRO AO REGISTAR PRODUÇÃO:',
        error
      )

      setMensagem(
        'Ocorreu um erro de comunicação com o servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-8 text-[#382515]">
      <div className="mx-auto max-w-2xl">

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push('/produtor')
            }
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            ← Voltar para o painel
          </button>

          <h1 className="mt-4 text-3xl font-bold">
            Registar produção
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Informe o produto produzido e a
            quantidade. A produção será
            automaticamente associada à sua
            conta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <div className="space-y-5">

            <div>
              <label
                htmlFor="produto"
                className="mb-2 block text-sm font-semibold"
              >
                Produto
              </label>

              <input
                id="produto"
                type="text"
                value={produtoNome}
                onChange={(event) =>
                  setProdutoNome(
                    event.target.value
                  )
                }
                placeholder="Ex.: Castanha de caju"
                autoComplete="off"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="mb-2 block text-sm font-semibold"
              >
                Quantidade produzida
              </label>

              <div className="flex">
                <input
                  id="quantidade"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(
                      event.target.value
                    )
                  }
                  placeholder="0"
                  required
                  className="w-full rounded-l-2xl border border-r-0 border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <span className="flex items-center rounded-r-2xl bg-gray-100 px-5 text-sm font-semibold">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="dataProducao"
                className="mb-2 block text-sm font-semibold"
              >
                Data da produção
              </label>

              <input
                id="dataProducao"
                type="date"
                value={dataProducao}
                onChange={(event) =>
                  setDataProducao(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>

          {mensagem && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="mt-6 w-full rounded-2xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando
              ? 'A registar...'
              : 'Registar produção'}
          </button>

        </form>

      </div>
    </main>
  )
}

