
'use client'

import { FormEvent, useState } from 'react'

import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from 'lucide-react'

import { useRouter } from 'next/navigation'

interface FormularioRegistoProps {
  tipo: string
  perfil: string
  descricao?: string
}

const PERFIL_SLUG: Record<string, string> = {
  Produtor: 'produtor',
  Cliente: 'cliente',
  Entregador: 'entregador',
  Fornecedor: 'fornecedor',
  Processador: 'processador',
  Transportador: 'transportador',
}

export default function FormularioRegisto({
  tipo,
  perfil,
  descricao,
}: FormularioRegistoProps) {
  const router = useRouter()

  // DADOS DO UTILIZADOR
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [localizacao, setLocalizacao] = useState('')

  // PIN DE ACESSO
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // VISIBILIDADE DO PIN
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  // ESTADOS DA INTERFACE
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

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

  // LIMPAR MENSAGENS
  function limparMensagens() {
    setErro('')
    setSucesso('')
  }

  // CRIAR CONTA
  async function criarConta(event: FormEvent) {
    event.preventDefault()

    limparMensagens()

    // VALIDAR NOME
    if (!nome.trim()) {
      setErro('Informe o seu nome completo.')
      return
    }

    // VALIDAR TELEFONE
    if (!telefone.trim()) {
      setErro('Informe o seu número de telemóvel.')
      return
    }

    const telefoneNormalizado = normalizarTelefone(telefone)

    // VALIDAR FORMATO DO NÚMERO MOÇAMBICANO
    if (!/^\+2588[2-7]\d{7}$/.test(telefoneNormalizado)) {
      setErro(
        'Informe um número de telemóvel moçambicano válido. Exemplo: 841234567.'
      )
      return
    }

    // VALIDAR PIN
    if (!senha || !confirmarSenha) {
      setErro('Preencha os campos de PIN.')
      return
    }

    if (!/^\d{4}$/.test(senha)) {
      setErro('O PIN deve conter exactamente 4 dígitos.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('Os PINs não coincidem.')
      return
    }

    // VALIDAR LOCALIZAÇÃO
    if (!localizacao.trim()) {
      setErro('Informe a sua localização.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch('/api/auth/registo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo,
          nome: nome.trim(),
          telefone: telefoneNormalizado,
          senha,
          localizacao: localizacao.trim(),
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok || !dados.sucesso) {
        setErro(
          dados.mensagem ||
            'Não foi possível criar a sua conta.'
        )
        return
      }

      setSucesso('Conta criada com sucesso!')

      const perfilSlug =
        PERFIL_SLUG[tipo] || perfil.toLowerCase()

      router.push(`/registo/${perfilSlug}/entrar`)

    } catch {
      setErro(
        'Não foi possível comunicar com o servidor. Tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff8e8] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* VOLTAR */}

        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e7d5b8] p-6">

          {/* CABEÇALHO */}

          <div className="text-center mb-7">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#001431] text-white">
              {sucesso ? (
                <CheckCircle size={28} />
              ) : (
                <UserPlus size={28} />
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#001431]">
              Criar conta
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {descricao || `Registo de ${tipo}.`}
            </p>

          </div>

          {/* MENSAGEM DE ERRO */}

          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          {/* MENSAGEM DE SUCESSO */}

          {sucesso && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {sucesso}
            </div>
          )}

          {/* FORMULÁRIO */}

          <form
            onSubmit={criarConta}
            className="space-y-5"
          >

            {/* NOME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome completo
              </label>

              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Introduza o seu nome completo"
                autoComplete="name"
                required
                disabled={carregando}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#001431]"
              />

            </div>

            {/* TELEFONE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Número de telemóvel
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                placeholder="84 123 4567"
                autoComplete="tel"
                inputMode="tel"
                required
                disabled={carregando}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#001431]"
              />

              <p className="mt-1 text-xs text-gray-500">
                Introduza o seu número de telemóvel de Moçambique.
              </p>

            </div>

            {/* PIN */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                PIN de acesso
              </label>

              <div className="relative">

                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value.replace(/\D/g, '').slice(0, 4)
                    )
                  }
                  placeholder="• • • •"
                  autoComplete="new-password"
                  maxLength={4}
                  required
                  disabled={carregando}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 tracking-[0.4em] outline-none focus:border-[#001431]"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#001431]"
                  aria-label={mostrarSenha ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {mostrarSenha ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              <p className="mt-1 text-xs text-gray-500">
                Crie um PIN de exactamente 4 dígitos.
              </p>

            </div>

            {/* CONFIRMAR PIN */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirmar PIN
              </label>

              <div className="relative">

                <input
                  type={mostrarConfirmacao ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(
                      event.target.value.replace(/\D/g, '').slice(0, 4)
                    )
                  }
                  placeholder="• • • •"
                  autoComplete="new-password"
                  maxLength={4}
                  required
                  disabled={carregando}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 tracking-[0.4em] outline-none focus:border-[#001431]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmacao(!mostrarConfirmacao)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#001431]"
                  aria-label={
                    mostrarConfirmacao
                      ? 'Ocultar confirmação'
                      : 'Mostrar confirmação'
                  }
                >
                  {mostrarConfirmacao ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

            </div>

            {/* LOCALIZAÇÃO */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Localização
              </label>

              <input
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
                placeholder="Cidade / Bairro"
                required
                disabled={carregando}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#001431]"
              />

            </div>

            {/* BOTÃO CRIAR CONTA */}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-[#001431] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >

              {carregando ? (

                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Criando conta...
                </span>

              ) : (
                'Criar conta'
              )}

            </button>

          </form>

          {/* RODAPÉ */}

          <p className="mt-5 text-center text-xs text-gray-500">
            O seu número de telemóvel será utilizado para entrar
            na sua conta através do PIN de acesso.
          </p>

        </div>
      </div>
    </div>
  )
}
