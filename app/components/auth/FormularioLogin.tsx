
'use client'

import {
  FormEvent,
  useState,
} from 'react'

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Phone,
  LockKeyhole,
} from 'lucide-react'

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
  perfil,
  descricao,
}: FormularioLoginProps) {
  const router = useRouter()

  // DADOS DE ACESSO
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')

  // VISIBILIDADE DO PIN
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // ESTADOS DA INTERFACE
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  // NORMALIZAR TELEFONE
  function normalizarTelefone(valor: string) {
    const numero = valor.replace(/[\s()-]/g, '')

    if (numero.startsWith('+258')) {
      return numero
    }

    if (numero.startsWith('258') && numero.length === 12) {
      return `+${numero}`
    }

    if (numero.length === 9) {
      return `+258${numero}`
    }

    return numero
  }

  // PROCESSAR LOGIN
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setErro('')
    setSucesso(false)

    // VALIDAR TELEFONE
    if (!telefone.trim()) {
      setErro('Informe o seu número de telemóvel.')
      return
    }

    const telefoneNormalizado = normalizarTelefone(telefone)

    if (!/^\+2588[2-7]\d{7}$/.test(telefoneNormalizado)) {
      setErro(
        'Informe um número de telemóvel válido. Exemplo: 841234567.'
      )
      return
    }

    // VALIDAR PIN
    if (!senha) {
      setErro('Informe o seu PIN de acesso.')
      return
    }

    if (!/^\d{4}$/.test(senha)) {
      setErro('O PIN deve conter exactamente 4 dígitos.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          telefone: telefoneNormalizado,
          senha,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok || !dados.sucesso) {
        setErro(
          dados?.mensagem ||
          'Número de telemóvel ou PIN incorretos.'
        )
        return
      }

      // IDENTIFICAR PERFIL DO UTILIZADOR
      const perfilUsuario = String(
        dados?.usuario?.perfil ?? ''
      ).toUpperCase()

      const perfilEsperado = String(
        perfil ?? ''
      ).toUpperCase()

      // VALIDAR PERFIL
      if (
        perfilEsperado &&
        perfilUsuario !== perfilEsperado
      ) {
        setErro(
          `Esta conta não está registada como ${tipo.toLowerCase()}.`
        )
        return
      }

      // IDENTIFICAR ROTA
      const rota = ROTAS_PERFIL[perfilUsuario]

      if (!rota) {
        setErro(
          'O perfil da conta não foi reconhecido.'
        )
        return
      }

      setSucesso(true)

      // REDIRECCIONAR
      router.replace(rota)
      router.refresh()

    } catch (error) {
      console.error('ERRO NO LOGIN:', error)

      setErro(
        'Não foi possível comunicar com o servidor. Tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-10 text-[#382515]">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

        <div className="w-full rounded-3xl bg-white p-6 shadow-lg md:p-8">

          {/* CABEÇALHO */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <LockKeyhole size={30} />
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

          {/* FORMULÁRIO */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* TELEFONE */}

            <div>

              <label
                htmlFor="telefone"
                className="mb-2 block text-sm font-semibold"
              >
                Número de telemóvel
              </label>

              <div className="relative">

                <Phone
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(event) =>
                    setTelefone(event.target.value)
                  }
                  placeholder="84 123 4567"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  disabled={carregando}
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                />

              </div>

            </div>

            {/* PIN */}

            <div>

              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold"
              >
                PIN de acesso
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value
                        .replace(/\D/g, '')
                        .slice(0, 4)
                    )
                  }
                  placeholder="Digite os 4 dígitos"
                  autoComplete="current-password"
                  maxLength={4}
                  required
                  disabled={carregando}
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-12 pr-12 tracking-[0.4em] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(!mostrarSenha)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                  aria-label={
                    mostrarSenha
                      ? 'Ocultar PIN'
                      : 'Mostrar PIN'
                  }
                >
                  {mostrarSenha ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              <p className="mt-1 text-xs text-gray-500">
                Introduza o PIN de 4 dígitos definido no cadastro.
              </p>

            </div>

            {/* ERRO */}

            {erro && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            {/* SUCESSO */}

            {sucesso && (
              <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                Login efectuado com sucesso. A abrir o seu painel...
              </div>
            )}

            {/* BOTÃO ENTRAR */}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-green-700 px-5 py-4 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {carregando ? (

                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  A entrar...
                </span>

              ) : (
                'Entrar'
              )}

            </button>

          </form>

          {/* RODAPÉ */}

          <div className="mt-6 text-center">

            <p className="text-xs text-gray-500">
              Aceda à sua conta utilizando o número de telemóvel
              e o PIN de acesso.
            </p>

          </div>

        </div>

      </div>

    </main>
  )
}
