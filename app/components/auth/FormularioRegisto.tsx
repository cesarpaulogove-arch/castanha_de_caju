
'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormularioRegistoProps {
  tipo: string
  descricao: string
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
  descricao,
}: FormularioRegistoProps) {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const submeterFormulario = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setErro('')
    setSucesso(false)

    // =========================
    // VALIDAR SENHAS
    // =========================

    if (senha !== confirmarSenha) {
      setErro('As palavras-passe não coincidem.')
      return
    }

    if (senha.length < 6) {
      setErro(
        'A palavra-passe deve ter pelo menos 6 caracteres.'
      )
      return
    }

    // =========================
    // VALIDAR PERFIL
    // =========================

    const perfilSlug = PERFIL_SLUG[tipo]

    if (!perfilSlug) {
      setErro('Perfil inválido.')
      return
    }

    // =========================
    // INICIAR ENVIO
    // =========================

    setCarregando(true)

    try {
      // =========================
      // ENVIAR PARA A API
      // =========================

      const resposta = await fetch('/api/auth/registo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo,
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim().toLowerCase(),
          localizacao: localizacao.trim(),
          senha,
        }),
      })

      // =========================
      // LER RESPOSTA
      // =========================

      const dados = await resposta.json()

      // =========================
      // TRATAR ERRO
      // =========================

      if (!resposta.ok || !dados.sucesso) {
        setErro(
          dados.mensagem ||
            'Não foi possível criar a conta.'
        )
        return
      }

      // =========================
      // SUCESSO
      // =========================

      setSucesso(true)

      // =========================
      // IR PARA LOGIN DO PERFIL
      // =========================

      setTimeout(() => {
        router.push(`/registo/${perfilSlug}/entrar`)
      }, 1200)
    } catch (error) {
      console.error(
        'ERRO AO ENVIAR REGISTO:',
        error
      )

      setErro(
        'Não foi possível comunicar com o servidor. Verifique a sua ligação e tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-6">
      <div className="mx-auto w-full max-w-lg">

        {/* VOLTAR */}
        <button
          type="button"
          onClick={() => router.back()}
          disabled={carregando}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#166534] transition hover:text-[#14532d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        {/* CARD */}
        <div className="rounded-3xl border border-[#e7d5b8] bg-white p-5 shadow-sm sm:p-7">

          {/* CABEÇALHO */}
          <div className="mb-6 text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#166534] text-white">
              <UserPlus size={30} />
            </div>

            <h1 className="text-2xl font-bold text-[#422006]">
              Registo de {tipo}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {descricao}
            </p>

          </div>

          {/* FORMULÁRIO */}
          <form
            onSubmit={submeterFormulario}
            className="space-y-4"
          >

            {/* NOME */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Nome completo
              </label>

              <input
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Digite o seu nome completo"
                required
                disabled={carregando}
                autoComplete="name"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* TELEFONE */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Número de telefone
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(event) =>
                  setTelefone(event.target.value)
                }
                placeholder="+258 84 000 0000"
                required
                disabled={carregando}
                autoComplete="tel"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="exemplo@email.com"
                required
                disabled={carregando}
                autoComplete="email"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* LOCALIZAÇÃO */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Localização
              </label>

              <input
                type="text"
                value={localizacao}
                onChange={(event) =>
                  setLocalizacao(event.target.value)
                }
                placeholder="Bairro, cidade ou distrito"
                required
                disabled={carregando}
                autoComplete="address-level2"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* SENHA */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Palavra-passe
              </label>

              <input
                type="password"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                placeholder="Mínimo de 6 caracteres"
                required
                minLength={6}
                disabled={carregando}
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Confirmar palavra-passe
              </label>

              <input
                type="password"
                value={confirmarSenha}
                onChange={(event) =>
                  setConfirmarSenha(event.target.value)
                }
                placeholder="Repita a palavra-passe"
                required
                minLength={6}
                disabled={carregando}
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none transition focus:border-[#166534] disabled:bg-gray-100"
              />
            </div>

            {/* ERRO */}
            {erro && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
              >
                {erro}
              </div>
            )}

            {/* SUCESSO */}
            {sucesso && (
              <div
                role="status"
                className="rounded-xl bg-green-50 p-3 text-sm text-green-700"
              >
                Conta criada com sucesso. A redirecionar para o
                login...
              </div>
            )}

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={carregando || sucesso}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 font-bold text-white transition hover:bg-[#14532d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carregando ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Criando conta...
                </>
              ) : sucesso ? (
                'Conta criada'
              ) : (
                <>
                  <UserPlus size={20} />
                  Criar registo
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  )
}
