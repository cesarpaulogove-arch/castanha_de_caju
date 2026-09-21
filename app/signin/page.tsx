
'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LogIn,
  Mail,
  Lock,
  CheckCircle,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function SignIn() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [estaAProcessar, setEstaAProcessar] = useState(false)
  const [erro, setErro] = useState('')

  const gerirLogin = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (estaAProcessar) return

    setErro('')
    setSucesso(false)

    const emailNormalizado = email.trim().toLowerCase()

    if (!emailNormalizado || !password) {
      setErro(
        'Informe o email e a palavra-passe.'
      )
      return
    }

    setEstaAProcessar(true)

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({
          email: emailNormalizado,
          senha: password,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok || !dados?.sucesso) {
        setErro(
          dados?.mensagem ||
            'Email ou palavra-passe incorretos.'
        )
        setEstaAProcessar(false)
        return
      }

      const perfil = String(
        dados?.usuario?.perfil ?? ''
      ).toUpperCase()

      /*
       * O servidor já identificou o perfil.
       *
       * GESTOR
       * → /gestao
       *
       * Qualquer outro perfil
       * → /
       */
      setSucesso(true)

      if (perfil === 'GESTOR') {
        router.replace('/gestao')
      } else {
        router.replace('/')
      }

      router.refresh()
    } catch (error) {
      console.error(
        'ERRO AO AUTENTICAR UTILIZADOR:',
        error
      )

      setErro(
        'Não foi possível comunicar com o servidor. Verifique a sua ligação e tente novamente.'
      )

      setEstaAProcessar(false)
    }
  }

  /*
   * ======================================================
   * ECRÃ DE SUCESSO
   * ======================================================
   */

  if (sucesso) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8e8] px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-[#e7d5b8] bg-white p-8 text-center shadow-[0_15px_45px_rgba(92,64,32,0.10)] sm:p-10">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle
              size={36}
              className="text-green-600"
            />
          </div>

          <h1 className="text-2xl font-extrabold text-[#382515]">
            Acesso Autorizado!
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#806b55]">
            A sua conta foi autenticada com sucesso.
          </p>

          <div className="mt-6 rounded-2xl bg-green-50 p-4 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={21}
                className="text-green-600"
              />

              <span className="font-bold text-green-800">
                Sessão Ativa
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-green-700">
              O sistema identificou automaticamente
              o seu perfil de acesso.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#806b55]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#166534] border-t-transparent" />

            A entrar...
          </div>

        </div>
      </main>
    )
  }

  /*
   * ======================================================
   * LOGIN
   * ======================================================
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8e8] px-4 py-8">
      <div className="w-full max-w-md">

        {/* Cabeçalho */}
        <div className="mb-7 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#166534] shadow-lg shadow-green-900/10">

            <UserRound
              size={30}
              className="text-white"
            />

          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#382515]">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-sm text-[#806b55]">
            Entre na sua conta para continuar.
          </p>

        </div>

        {/* Cartão */}
        <div className="rounded-3xl border border-[#e7d5b8] bg-white p-7 shadow-[0_15px_45px_rgba(92,64,32,0.10)] sm:p-9">

          <div className="mb-7">

            <h2 className="text-xl font-extrabold text-[#382515]">
              Entrar
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#806b55]">
              Informe apenas os seus dados de acesso.
              O sistema identifica automaticamente o
              seu perfil.
            </p>

          </div>

          <form
            onSubmit={gerirLogin}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-[#382515]"
              >
                Email
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a58b6d]"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="seuemail@email.com"
                  required
                  autoComplete="email"
                  disabled={estaAProcessar}
                  className="w-full rounded-xl border border-[#e7d5b8] bg-[#fffdf8] py-3.5 pl-12 pr-4 text-sm text-[#382515] outline-none transition placeholder:text-[#b9a58d] focus:border-[#166534] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>

            {/* PALAVRA-PASSE */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-[#382515]"
                >
                  Palavra-passe
                </label>

                <Link
                  href="/recuperar-password"
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  Esqueceu-se?
                </Link>

              </div>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a58b6d]"
                />

                <input
                  id="password"
                  type={
                    mostrarPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Digite a sua palavra-passe"
                  required
                  autoComplete="current-password"
                  disabled={estaAProcessar}
                  className="w-full rounded-xl border border-[#e7d5b8] bg-[#fffdf8] py-3.5 pl-12 pr-12 text-sm text-[#382515] outline-none transition placeholder:text-[#b9a58d] focus:border-[#166534] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarPassword(
                      (estado) => !estado
                    )
                  }
                  aria-label={
                    mostrarPassword
                      ? 'Ocultar palavra-passe'
                      : 'Mostrar palavra-passe'
                  }
                  disabled={estaAProcessar}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a58b6d] transition hover:text-[#166534] disabled:opacity-50"
                >
                  {mostrarPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ERRO */}
            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {erro}
              </div>
            )}

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={estaAProcessar}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#166534] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#14532d] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {estaAProcessar ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  A verificar...
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  Entrar
                </>
              )}

            </button>

          </form>

          {/* REGISTO */}
          <div className="mt-7 border-t border-[#f0e5d5] pt-6 text-center">

            <p className="text-sm text-[#806b55]">
              Ainda não possui uma conta?
            </p>

            <Link
              href="/registo"
              className="mt-2 inline-block text-sm font-extrabold text-[#166534] transition hover:text-[#14532d] hover:underline"
            >
              Criar uma conta
            </Link>

          </div>

        </div>

        {/* Rodapé */}
        <p className="mt-6 text-center text-xs text-[#a58b6d]">
          © {new Date().getFullYear()} Castanha de Caju.
          Todos os direitos reservados.
        </p>

      </div>
    </main>
  )
}

