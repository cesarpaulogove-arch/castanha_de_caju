'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserPlus, User, Mail, Lock, Phone, CheckCircle, ShieldAlert } from 'lucide-react'

export default function SignUpEmpresa() {
  // Estados para capturar os dados do utilizador
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  
  // Estados de controlo da interface
  const [sucesso, setSucesso] = useState(false)
  const [estaAProcessar, setEstaAProcessar] = useState(false)

  const gerirRegisto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !email || !telefone || !password || estaAProcessar) return

    setEstaAProcessar(true)

    try {
      // Podes descomentar a lógica abaixo assim que ligares ao teu backend/banco de dados
      /*
      import { auth, db } from '../lib/firebase'
      import { createUserWithEmailAndPassword } from 'firebase/auth'
      import { doc, setDoc } from 'firebase/firestore'
      
      const credenciais = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'utilizadores', credenciais.user.uid), {
        nomeCompleto: nome,
        email: email,
        telefone: telefone,
        dataCriacao: new Date()
      })
      */

      // Simulação de delay de rede para testes visuais no Android
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSucesso(true)

    } catch (error) {
      console.error("Erro ao criar conta:", error)
      alert("Houve um problema ao criar a sua conta. Tente novamente.")
    } finally {
      setEstaAProcessar(false)
    }
  }

  return (
    /* pt-2 md:pt-4 elimina o espaço em branco inicial para colar perfeitamente ao Header */
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

      {/* CARTÃO CENTRAL DO FORMULÁRIO */}
      <div className="w-full max-w-md bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl z-10 mt-1">
        
        {!sucesso ? (
          <form onSubmit={gerirRegisto} className="space-y-4">
            
            {/* CABEÇALHO DO REGISTO */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider uppercase text-white">Criar Nova Conta</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Regista-te no painel da Fábrica SIDCode Pay.</p>
              </div>
            </div>

            {/* Input Nome Completo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-500" /> Nome Completo
              </label>
              <input 
                type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Amélia Lucas Sitoe"
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> Endereço de Email
              </label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: amelia@gmail.com"
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Input Telefone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-500" /> Contacto WhatsApp
              </label>
              <input 
                type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: +258 84 123 4567"
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
                placeholder="Introduza um código seguro"
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Botão de Envio (Destaque Grande para Android) */}
            <button 
              type="submit"
              disabled={estaAProcessar}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg mt-2"
            >
              {estaAProcessar ? 'A processar registo...' : 'Finalizar e Registar'}
            </button>

            {/* Link alternativo para o Sign In */}
            <p className="text-center text-[11px] text-gray-400 font-medium pt-1">
              Já possui uma conta?{' '}
              <Link href="/signin" className="text-amber-400 font-bold hover:underline">
                Faça Sign In
              </Link>
            </p>

          </form>
        ) : (
          /* TELA DE CONFIGURAÇÃO CONCLUÍDA COM SUCESSO */
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">Conta Criada!</h3>
              <p className="text-xs text-gray-400 mt-1">O seu perfil de cliente foi ativado no sistema.</p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-left text-[11px] space-y-1 text-gray-300">
              <p className="text-white font-bold mb-1 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> O que fazer agora?</p>
              <p>1. Volte ao painel principal de pedidos rápidos.</p>
              <p>2. Os seus futuros lotes ficarão atrelados ao seu histórico.</p>
            </div>

                        {/* Link para regressar à loja principal (O teu ponto de partida) */}
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
