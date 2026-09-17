'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  User,
  Phone,
  Menu,
  X,
  LogIn,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'

const OPCOES_MENU = [
  {
    nome: 'Login',
    descricao: 'Entrar na sua conta',
    href: '/signin',
    icone: LogIn,
  },
  {
    nome: 'Nosso perfil',
    descricao: 'Conheça o nosso perfil',
    href: '/perfil',
    icone: User,
  },
  {
    nome: 'Nossos contactos',
    descricao: 'Entre em contacto connosco',
    href: '/contactos',
    icone: Phone,
  },
  {
    nome: 'Chat',
    descricao: 'Fale directamente connosco',
    href: '/chat',
    icone: MessageCircle,
  },
]

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  const fecharMenu = () => {
    setMenuAberto(false)
  }

  return (
    <>
      {/* ESPAÇO RESERVADO PARA O HEADER FIXO */}
      <div className="h-[65px] w-full shrink-0" />

      {/* HEADER FIXO */}
      <header className="fixed left-0 right-0 top-0 z-[999999] w-full">
        <nav className="relative z-[999999] w-full bg-[#161616]/95 px-4 pb-3 pt-1 backdrop-blur-none md:px-6">
          <div className="flex h-12 w-full items-center justify-between">
            {/* LOGOTIPO */}
            <Link
              href="/"
              onClick={fecharMenu}
              className="group flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] font-black text-[#422006] transition-transform duration-300 group-hover:scale-110">
                C
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-sm font-black uppercase tracking-wide text-white">
                  Castanha
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#facc15]">
                  de caju
                </span>
              </div>
            </Link>

            {/* MENU DESKTOP */}
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-sm font-semibold text-white transition-colors hover:text-[#facc15]"
              >
                Início
              </Link>

              <Link
                href="/grandes-volumes"
                className="text-sm font-semibold text-white transition-colors hover:text-[#facc15]"
              >
                Grandes volumes
              </Link>

              <Link
                href="/perfil"
                className="text-sm font-semibold text-white transition-colors hover:text-[#facc15]"
              >
                Perfil
              </Link>

              <Link
                href="/contactos"
                className="text-sm font-semibold text-white transition-colors hover:text-[#facc15]"
              >
                Contactos
              </Link>

              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-full bg-[#facc15] px-4 py-2 text-sm font-bold text-[#422006] transition-all duration-300 hover:scale-105 hover:bg-[#fde047]"
              >
                <MessageCircle size={16} />
                Chat
              </Link>
            </div>

            {/* BOTÃO MENU MOBILE */}
            <button
              type="button"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((estado) => !estado)}
              className="relative z-[1000000] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 md:hidden"
            >
              {menuAberto ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>

          {/* MENU MOBILE */}
          {menuAberto && (
            <div
              className="absolute right-3 top-[calc(100%+8px)] z-[9999999] w-[285px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#3b3b3b] bg-[#161616] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.75)] md:hidden"
              role="menu"
            >
              <div className="mb-3 border-b border-white/10 px-3 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#facc15]">
                  Menu
                </p>

                <p className="mt-1 text-xs text-white/50">
                  Escolha uma opção
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {OPCOES_MENU.map((opcao) => {
                  const Icone = opcao.icone

                  return (
                    <Link
                      key={opcao.href}
                      href={opcao.href}
                      onClick={fecharMenu}
                      role="menuitem"
                      className="group flex items-center gap-3 rounded-xl border border-transparent bg-white/[0.04] px-3 py-3 transition-all duration-300 hover:border-[#facc15]/40 hover:bg-[#facc15]/10"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#facc15] transition-colors duration-300 group-hover:bg-[#facc15] group-hover:text-[#422006]">
                        <Icone size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">
                          {opcao.nome}
                        </p>

                        <p className="mt-0.5 text-[11px] leading-4 text-white/50">
                          {opcao.descricao}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#facc15]"
                      />
                    </Link>
                  )
                })}
              </div>

              <Link
                href="/grandes-volumes"
                onClick={fecharMenu}
                className="mt-3 flex items-center justify-center rounded-xl bg-[#facc15] px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#422006] transition-all duration-300 hover:bg-[#fde047]"
              >
                Comprar grandes volumes
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}