'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Menu,
  X,
  LogIn,
  UserRound,
  Phone,
  MessageCircle,
} from 'lucide-react'

const CONTEUDO_ROTATIVO = [
  {
    linha1: 'Castanhas Frescas',
    linha2: 'Sabor no Ponto',
    chamada: 'Faça já a tua encomenda',
    imagemDireita: '/castanha_img.jpg',
  },
  {
    linha1: 'Projetos de Robótica e Protótipos Inteligentes',
    linha2:
      'Desenvolvimento Avançado enquanto Saboreia as Castanhas da Diango Aninha',
    chamada: 'Inovação, Engenharia e Sabor com a Assinatura SIDCode',
    imagemDireita: '/robo.png',
  },
  {
    linha1: 'Transformamos e prototipamos ideias em soluções',
    linha2:
      'Enquanto saboreia a deliciosa Castanha da Diango Aninha',
    chamada: 'Tecnologia e sabor em perfeita harmonia',
    imagemDireita: '/code.png',
  },
  {
    linha1: 'Qualidade Premium',
    linha2: 'Direto de Inhambane',
    chamada: 'Aproveite a entrega grátis',
    imagemDireita: '/baldegrande.png',
  },
]

const OPCOES_MENU = [
  {
    nome: 'Login',
    href: '/login',
    icone: LogIn,
  },
  {
    nome: 'Nosso perfil',
    href: '/perfil',
    icone: UserRound,
  },
  {
    nome: 'Nossos contactos',
    href: '/contactos',
    icone: Phone,
  },
  {
    nome: 'Chat',
    href: '/chat',
    icone: MessageCircle,
  },
]

export default function Banner() {
  const [indice, setIndice] = useState(0)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice(
        (prev) => (prev + 1) % CONTEUDO_ROTATIVO.length
      )
    }, 8000)

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div
      className="
        relative flex min-h-[160px] w-full
        items-center overflow-visible
        rounded-xl border border-white/10
        bg-white/[0.01]
        shadow-2xl transition-all duration-300
        lg:h-44
      "
    >
      {/* Botão de expandir — apenas no telemóvel */}
      <button
        type="button"
        aria-label={
          menuAberto
            ? 'Fechar menu'
            : 'Abrir menu'
        }
        aria-expanded={menuAberto}
        onClick={() => setMenuAberto(!menuAberto)}
        className="
          absolute right-3 top-3 z-50
          flex h-10 w-10 items-center
          justify-center rounded-full
          border border-white/20
          bg-[#166534] text-white
          shadow-lg transition
          hover:bg-[#14532d]
          lg:hidden
        "
      >
        {menuAberto ? (
          <X size={21} />
        ) : (
          <Menu size={21} />
        )}
      </button>

      {/* Menu vertical compacto */}
      {menuAberto && (
        <div
          className="
            absolute right-3 top-14 z-40
            w-[280px] max-w-[calc(100%-24px)]
            overflow-hidden rounded-2xl
            border border-[#e7d5b8]
            bg-white p-3 shadow-2xl
            lg:hidden
          "
        >
          <div className="mb-3 border-b border-[#f0e2cf] pb-3">
            <h2 className="text-sm font-black uppercase text-[#422006]">
              Menu
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Aceda às nossas opções
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {OPCOES_MENU.map((opcao) => {
              const Icone = opcao.icone

              return (
                <a
                  key={opcao.nome}
                  href={opcao.href}
                  onClick={() => setMenuAberto(false)}
                  className="
                    flex items-center gap-3
                    rounded-xl border
                    border-transparent
                    px-3 py-3
                    text-sm font-semibold
                    text-[#422006]
                    transition
                    hover:border-[#e7d5b8]
                    hover:bg-[#fff8e8]
                  "
                >
                  <span
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      bg-[#166534]
                      text-white
                    "
                  >
                    <Icone size={17} />
                  </span>

                  <span>{opcao.nome}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Estrutura principal */}
      <div className="z-10 flex h-full w-full items-center">
        {/* Coluna esquerda */}
        <div
          className="
            flex h-full w-32 shrink-0
            select-none flex-col
            items-center justify-between
            border-r border-white/10
            px-2 py-4
            sm:w-48 sm:px-6
          "
        >
          {/* Logo */}
          <div
            className="
              relative h-16 w-16
              transition-transform duration-500
              hover:scale-105
              sm:h-20 sm:w-20
            "
          >
            <Image
              src="/logo.png"
              alt="Imagem de Águia"
              fill
              className="
                object-contain
                drop-shadow-[0_4px_12px_rgba(212,255,33,0.15)]
                animate-pulse
                [animation-duration:4s]
              "
              priority
            />
          </div>

          {/* Espaço da marca */}
          <div
            className="
              flex items-center gap-1
              rounded border border-white/5
              bg-white/[0.02]
              px-3 py-1 shadow-sm
            "
          >
            <span
              className="
                text-[11px] font-black
                uppercase tracking-[0.15em]
                text-gray-300
              "
            />
          </div>

          {/* Nome */}
          <span
            className="
              mt-2 text-center
              text-[10px] font-black
              leading-tight tracking-wider
              text-amber-500
              sm:text-xs
            "
          >
            CASTANHAS DIANGO ANINHA
          </span>
        </div>

        {/* Coluna direita */}
        <div
          className="
            relative flex h-full
            min-w-0 flex-1
            items-center
            justify-between
            pl-3 pr-2
            sm:pl-8 sm:pr-4
          "
        >
          {/* Textos rotativos */}
          <div
            className="
              relative flex h-full
              min-w-0 flex-1
              flex-col justify-center
              pr-1 sm:pr-4
            "
          >
            {CONTEUDO_ROTATIVO.map((item, index) => (
              <div
                key={index}
                className={`
                  absolute inset-y-0 left-0
                  flex w-full flex-col
                  justify-center space-y-2
                  transition-all duration-1000
                  ease-in-out
                  ${
                    indice === index
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-2 opacity-0'
                  }
                  ${
                    indice === index
                      ? 'pointer-events-auto'
                      : 'pointer-events-none'
                  }
                `}
              >
                <div className="space-y-0.5">
                  <h2
                    className="
                      line-clamp-2 break-words
                      text-xs font-black
                      uppercase tracking-wide
                      text-white
                      sm:text-base
                      md:text-lg
                    "
                  >
                    {item.linha1}
                  </h2>

                  <h3
                    className="
                      line-clamp-2 break-words
                      text-[10px] font-bold
                      uppercase tracking-wide
                      text-gray-400
                      sm:text-xs md:text-sm
                    "
                  >
                    {item.linha2}
                  </h3>
                </div>

                <p
                  className="
                    pt-1 text-[9px]
                    font-black uppercase
                    tracking-wider text-amber-500
                    sm:text-xs
                  "
                >
                  {item.chamada}
                </p>
              </div>
            ))}
          </div>

          {/* Imagem direita */}
          <div
            className="
              relative hidden h-full
              w-32 shrink-0
              items-center justify-center
              overflow-hidden
              sm:flex sm:w-40
              md:w-48
            "
          >
            {CONTEUDO_ROTATIVO.map((item, index) => (
              <Image
                key={index}
                src={item.imagemDireita}
                alt={`Imagem de transição ${index + 1}`}
                fill
                className={`
                  absolute object-contain py-2
                  drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]
                  transition-all duration-1000
                  ease-in-out
                  ${
                    indice === index
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-0'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}