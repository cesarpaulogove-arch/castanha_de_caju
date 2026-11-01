
'use client'

import {
  FormEvent,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

export default function EntregasPage() {
  const router = useRouter()

  const [compraId, setCompraId] = useState('')
  const [destino, setDestino] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setMensagem('')
    setCarregando(true)

    try {
      const resposta = await fetch(
        '/api/entregador/entregas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            compraId,
            destino,
            quantidade,
            dataEntrega,
            observacoes,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setMensagem(
          dados?.mensagem ||
          'Não foi possível registar a entrega.'
        )
        return
      }

      router.push('/entregador')
      router.refresh()

    } catch (error) {
      console.error('ERRO NA ENTREGA:', error)

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

        <button
          type="button"
          onClick={() => router.push('/entregador')}
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          ← Voltar para o painel
        </button>

        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold">
            Registar entrega
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Registe os dados da entrega realizada.
            O sistema associará automaticamente
            a operação à sua conta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-5">

            <div>
              <label
                htmlFor="compraId"
                className="mb-2 block text-sm font-semibold"
              >
                Referência da compra
              </label>

              <input
                id="compraId"
                type="number"
                min="1"
                value={compraId}
                onChange={(event) =>
                  setCompraId(event.target.value)
                }
                placeholder="Ex.: 125"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="destino"
                className="mb-2 block text-sm font-semibold"
              >
                Local de entrega
              </label>

              <input
                id="destino"
                type="text"
                value={destino}
                onChange={(event) =>
                  setDestino(event.target.value)
                }
                placeholder="Ex.: Bairro, cidade ou endereço"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="mb-2 block text-sm font-semibold"
              >
                Quantidade transportada
              </label>

              <div className="flex">
                <input
                  id="quantidade"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(event.target.value)
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
                htmlFor="dataEntrega"
                className="mb-2 block text-sm font-semibold"
              >
                Data da entrega
              </label>

              <input
                id="dataEntrega"
                type="date"
                value={dataEntrega}
                onChange={(event) =>
                  setDataEntrega(event.target.value)
                }
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="observacoes"
                className="mb-2 block text-sm font-semibold"
              >
                Observações
              </label>

              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(event) =>
                  setObservacoes(event.target.value)
                }
                placeholder="Informações adicionais sobre a entrega..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              : 'Registar entrega'}
          </button>

        </form>
      </div>
    </main>
  )
}
