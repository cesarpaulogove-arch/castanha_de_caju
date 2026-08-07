'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LogIn, Mail, Lock, CheckCircle, ShieldAlert } from 'lucide-react'

export default function SignInEmpresa() {
  // Estados para capturar os dados de login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Estados de controlo da interface
  const [sucesso, setSucesso] = useState(false)
  const [estaAProcessar, setEstaAProcessar] = useState(false)

  const gerirLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || estaAProcessar) return

    setEstaAProcessar(true)

    try {
      // Podes ativar a autenticação real do Firebase quando quiseres:
      /*
      import { auth } from '../lib/firebase'
      import { signInWithEmailAndPassword } from 'firebase/auth'
      await signInWithEmailAndPassword(auth, email, password)
      */

      // Simulação de delay de rede para testes visuais no Android
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setSucesso(true)

    } catch (error) {
      console.error("Erro ao autenticar utilizador:", error)
      alert("Credenciais incorretas. Por favor, verifique o email e a palavra-passe.")
    } finally {
      setEstaAProcessar(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white p-4 flex flex-col justify-start items-center select-none overflow-y-auto relative pt-2 md:pt-4 pb-12">
      
      {/* 🌳 IMAGEM DE CAJOEIRO - TOPO ESQUERDO */}
      <div className="fixed top-0 left-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image src="/cajoeiro_esquerdo.png" alt="Cajoeiro Esquerda" fill sizes="256px" className="object-contain object-top-left scale-110" priority />
      </div>

      {/* 🌳 IMAGEM DE CAJOEIRO - TOPO DIREITO */}
      <div className="fixed top-0 right-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image src="/cajoeiro_direito.png" alt="Cajoeiro Direita" fill sizes="256px" className="object-contain object-top-right scale-110" priority />
      </div>

      {/* 🍂 DECORAÇÕES LATERAIS DE CASTANHAS (3 por cada lado para simetria de ecrã) */}
      <div className="fixed top-[22%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed top-[55%] -translate-y-1/2 -left-8 md:-left-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed bottom-[10%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>

      <div className="fixed top-[22%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed top-[55%] -translate-y-1/2 -right-8 md:-right-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed bottom-[10%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>

      {/* CARTÃO CENTRAL DO FORMULÁRIO DE LOGIN */}
      <div className="w-full max-w-md bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-10 mt-1">
        
        {!sucesso ? (
          <form onSubmit={gerirLogin} className="space-y-4">
            
            {/* CABEÇALHO DO LOGIN */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider uppercase text-white">Autenticação de Conta</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Aceda ao seu painel de compras SIDCode Pay.</p>
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> Endereço de Email
              </label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Introduza o seu email registado"
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Input Palavra-passe */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> Palavra-passe
              </label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduza a sua palavra-passe"
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Botão de Envio */}
            <button 
              type="submit"
              disabled={estaAProcessar}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
            >
              {estaAProcessar ? 'A validar credenciais...' : 'Entrar no Sistema'}
            </button>

            {/* Link alternativo para o Sign Up */}
            <p className="text-center text-[11px] text-gray-400 font-medium pt-1">
              Ainda não possui uma conta?{' '}
              <Link href="/signup" className="text-amber-400 font-bold hover:underline">
                Registe-se aqui
              </Link>
            </p>

          </form>
        ) : (
          /* TELA DE LOGIN CONCLUÍDO COM SUCESSO */
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">Acesso Autorizado!</h3>
              <p className="text-xs text-gray-400 mt-1">Sessão validada com sucesso.</p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-left text-[11px] space-y-1 text-gray-300">
              <p className="text-white font-bold mb-1 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Sessão Ativa</p>
              <p>O seu histórico e preferências foram sincronizados com este dispositivo Android.</p>
            </div>

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
