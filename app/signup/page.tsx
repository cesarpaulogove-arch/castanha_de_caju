
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  UserPlus,
  User,
  Lock,
  Phone,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react'

export default function SignUpEmpresa() {
  // Dados do utilizador
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')

  // Controlo da interface
  const [sucesso, setSucesso] = useState(false)
  const [estaAProcessar, setEstaAProcessar] = useState(false)
  const [erro, setErro] = useState('')

  const gerirRegisto = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (estaAProcessar) return

    setErro('')

    const nomeNormalizado = nome.trim()
    const telefoneNormalizado = telefone.trim().replace(/\s+/g, '')

    if (!nomeNormalizado || !telefoneNormalizado || !password) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (password.length < 6) {
      setErro('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }

    setEstaAProcessar(true)

    try {
      const resposta = await fetch('/api/auth/registo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({
          nome: nomeNormalizado,
          telefone: telefoneNormalizado,
          senha: password,
          perfil: 'CLIENTE',
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok || !dados?.sucesso) {
        setErro(
          dados?.mensagem ||
            'Não foi possível criar a sua conta. Verifique os dados e tente novamente.'
        )
        return
      }

      setSucesso(true)

    } catch (error) {
      console.error('ERRO AO CRIAR CONTA:', error)

      setErro(
        'Não foi possível comunicar com o servidor. Verifique a sua ligação e tente novamente.'
      )
    } finally {
      setEstaAProcessar(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white p-4 flex flex-col justify-start items-center select-none overflow-y-auto relative pt-2 md:pt-4 pb-12">

      {/* CAJOEIRO - TOPO ESQUERDO */}
      <div className="fixed top-0 left-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image
          src="/cajoeiro_esquerdo.png"
          alt="Cajoeiro Esquerda"
          fill
          sizes="256px"
          className="object-contain object-top-left scale-110"
          priority
        />
      </div>

      {/* CAJOEIRO - TOPO DIREITO */}
      <div className="fixed top-0 right-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image
          src="/cajoeiro_direito.png"
          alt="Cajoeiro Direita"
          fill
          sizes="256px"
          className="object-contain object-top-right scale-110"
          priority
        />
      </div>

      {/* DECORAÇÕES LATERAIS */}
      <div className="fixed top-[22%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-12">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="fixed top-[55%] -translate-y-1/2 -left-8 md:-left-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-45">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="fixed bottom-[10%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="fixed top-[22%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="fixed top-[55%] -translate-y-1/2 -right-8 md:-right-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="fixed bottom-[10%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image
          src="/castanha_img.jpg"
          alt="Caju"
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      {/* CARTÃO CENTRAL */}
      <div className="w-full max-w-md bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-10 mt-1">

        {!sucesso ? (
          <form
            onSubmit={gerirRegisto}
            className="space-y-4"
          >

            {/* CABEÇALHO */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                <UserPlus className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-sm font-black tracking-wider uppercase text-white">
                  Criar Nova Conta
                </h2>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  Registe-se no painel da Fábrica SIDCode Pay.
                </p>
              </div>
            </div>

            {/* NOME */}
            <div className="space-y-1">
              <label
                htmlFor="nome"
                className="text-xs font-bold text-gray-400 flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                Nome Completo
              </label>

              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Amélia Lucas Sitoe"
                autoComplete="name"
                disabled={estaAProcessar}
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* TELEFONE */}
            <div className="space-y-1">
              <label
                htmlFor="telefone"
                className="text-xs font-bold text-gray-400 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                Número de Telefone
              </label>

              <input
                id="telefone"
                type="tel"
                inputMode="tel"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: 84 123 4567"
                autoComplete="tel"
                disabled={estaAProcessar}
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* PALAVRA-PASSE */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-xs font-bold text-gray-400 flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Palavra-passe
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduza uma palavra-passe segura"
                autoComplete="new-password"
                disabled={estaAProcessar}
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
              />
            </div>

            {/* ERRO */}
            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-xs leading-5 text-red-300"
              >
                {erro}
              </div>
            )}

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={estaAProcessar}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
            >
              {estaAProcessar
                ? 'A processar registo...'
                : 'Finalizar e Registar'}
            </button>

            {/* LOGIN */}
            <p className="text-center text-[11px] text-gray-400 font-medium pt-1">
              Já possui uma conta?{' '}
              <Link
                href="/signin"
                className="text-amber-400 font-bold hover:underline"
              >
                Faça Sign In
              </Link>
            </p>

          </form>
        ) : (

          /* SUCESSO */
          <div className="text-center space-y-4 py-2">

            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Conta Criada!
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                O seu perfil de cliente foi criado com sucesso.
              </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-left text-[11px] space-y-1 text-gray-300">
              <p className="text-white font-bold mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                O que fazer agora?
              </p>

              <p>1. Entre na sua conta utilizando o número de telefone.</p>
              <p>2. Os seus futuros lotes ficarão associados ao seu histórico.</p>
            </div>

            <Link
              href="/signin"
              className="w-full h-10 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-black transition-colors text-black uppercase tracking-wider flex items-center justify-center"
            >
              Entrar na minha conta
            </Link>

            <Link
              href="/"
              className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black transition-colors text-gray-200 uppercase tracking-wider flex items-center justify-center"
            >
              Ir para a Loja Principal
            </Link>

          </div>
        )}

      </div>
    </div>
  )
}
