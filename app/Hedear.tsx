'use client'
import Link from 'next/link'
import { useState } from 'react'
import { User, Phone, Menu, X, History, BarChart3 } from 'lucide-react'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    /* 
      - Removido 'border-b border-white/10' (Sem borda inferior)
      - Removido 'rounded-xl' (Sem cantos arredondados para não criar divisões)
      - Alterado 'mb-4' para 'mb-0' (Colado totalmente ao componente de baixo)
    */
    <nav className="w-full bg-[#161616]/80 pb-3 pt-1 mb-0 shrink-0 relative z-50 backdrop-blur-md px-4">
      <div className="flex items-center justify-between h-12 w-full">
        
        {/* ESQUERDA: MARCA PRINCIPAL (SIDCode) */}
        <div className="flex items-center min-w-0">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#D4FF21] shadow-[0_0_10px_#D4FF21] shrink-0" />
            <span className="text-sm md:text-base font-black tracking-wider text-white uppercase group-hover:text-[#D4FF21] transition-colors">
              Loja
            </span>
          </Link>
        </div>

        {/* CENTRO: Links de Navegação Atualizados */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Link href="/perfil" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <User className="w-3.5 h-3.5 text-amber-500" /> Perfil
          </Link>
        
          {/* Adicionado o link de Estatísticas */}
          
          <Link href="/contactos" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-amber-500" /> Contactos
          </Link>
        </div>

        {/* DIREITA: Autenticação */}
        

        {/* CONTROLO MOBILE: Botão Hambúrguer para Android */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-2 bg-black/40 border border-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
          >
            {menuAberto ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* DROPDOWN MENU PARA ANDROID */}
      {menuAberto && (
        <div className="absolute top-14 left-0 w-full bg-[#161616] border border-white/10 rounded-xl p-4 flex flex-col gap-4 md:hidden shadow-2xl z-50 animate-fade-in">
          <div className="flex flex-col gap-3 border-b border-white/5 pb-3">
            <Link 
              href="/perfil" 
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-gray-300 hover:text-white py-1"
            >
              <User className="w-4 h-4 text-amber-500" /> Perfil de Utilizador
            </Link>
            <Link 
              href="/historico" 
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-gray-300 hover:text-white py-1"
            >
              <History className="w-4 h-4 text-amber-500" /> Histórico de Encomendas
            </Link>
            {/* Adicionado o link de Estatísticas Mobile */}
            <Link 
              href="/estatistica" 
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-gray-300 hover:text-white py-1"
            >
              <BarChart3 className="w-4 h-4 text-amber-500" /> Gráficos e Estatísticas
            </Link>
            <Link 
              href="/contactos" 
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 text-sm font-bold text-gray-300 hover:text-white py-1"
            >
              <Phone className="w-4 h-4 text-amber-500" /> Nossos Contactos
            </Link>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Link 
              href="/signin" 
              onClick={() => setMenuAberto(false)}
              className="w-full py-2.5 text-center text-xs font-black text-white bg-white/5 border border-white/10 rounded-xl uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              onClick={() => setMenuAberto(false)}
              className="w-full py-2.5 text-center text-xs font-black text-black bg-amber-500 rounded-xl uppercase tracking-wider"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
