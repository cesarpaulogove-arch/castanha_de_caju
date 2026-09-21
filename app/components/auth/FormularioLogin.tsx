
'use client'

import {
  FormEvent,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

type FormularioLoginProps = {
  tipo: string
  perfil: string
  descricao?: string
}

const ROTAS_PERFIL: Record<string, string> = {
  GESTOR: '/gestao',
  PRODUTOR: '/produtor',
  CLIENTE: '/cliente',
  ENTREGADOR: '/entregador',
  FORNECEDOR: '/fornecedor',
  PROCESSADOR: '/processador',
  TRANSPORTADOR: '/transportador',
}

export default function FormularioLogin({
  tipo,
  descricao,
}: FormularioLoginProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErro('')
    setSucesso(false)
    setCarregando(true)

    try {
      const resposta = await fetch(
        '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            senha,
          }),
        }
      )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados?.mensagem ||
            'Email ou palavra-passe incorretos.'
        )
        return
      }

      const perfil = String(
        dados?.usuario?.perfil ?? ''
      ).toUpperCase()

      const rota = ROTAS_PERFIL[perfil]

      if (!rota) {
        setErro(
          'O perfil da conta não foi reconhecido.'
        )
        return
      }

      setSucesso(true)

      /*
       * Pequeno intervalo apenas para permitir
       * mostrar a mensagem de sucesso.
       */
      setTimeout(() => {
        router.replace(rota)
        router.refresh()
      }, 300)
    } catch (error) {
      console.error(
        'ERRO NO FORMULÁRIO DE LOGIN:',
        error
      )

      setErro(
        'Não foi possível comunicar com o servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-10 text-[#382515]">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

        <div className="w-full rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              👤
            </div>

            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              {tipo}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Entrar
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {descricao ||
                `Entre na sua conta de ${tipo.toLowerCase()} para continuar.`}
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="seu@email.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold"
              >
                Palavra-passe
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                placeholder="Digite a sua palavra-passe"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {erro && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                Login efetuado com sucesso.
                A abrir o seu painel...
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? 'A entrar...'
                : 'Entrar'}
            </button>

          </form>

        </div>

      </div>
    </main>
  )
}

