
'use client'

import {
  Sprout,
  ShoppingBag,
  Bike,
  Package,
  Factory,
  Truck,
  type LucideIcon,
} from 'lucide-react'

import { useRouter } from 'next/navigation'

// ============================================================
// TIPOS
// ============================================================

interface PerfilRegisto {
  id: string
  nome: string
  descricao: string
  icon: LucideIcon
  link: string
}

// ============================================================
// PERFIS DISPONÍVEIS
// ============================================================

const PERFIS: PerfilRegisto[] = [
  {
    id: 'produtor',
    nome: 'Produtor',
    descricao: 'Produza e venda castanhas',
    icon: Sprout,
    link: '/registo/produtor',
  },
  {
    id: 'cliente',
    nome: 'Cliente',
    descricao: 'Compre castanhas e produtos',
    icon: ShoppingBag,
    link: '/registo/cliente',
  },
  {
    id: 'entregador',
    nome: 'Entregador',
    descricao: 'Faça entregas aos clientes',
    icon: Bike,
    link: '/registo/entregador',
  },
  {
    id: 'fornecedor',
    nome: 'Fornecedor',
    descricao: 'Forneça produtos e materiais',
    icon: Package,
    link: '/registo/fornecedor',
  },
  {
    id: 'processador',
    nome: 'Processador',
    descricao: 'Transforme castanhas em produtos',
    icon: Factory,
    link: '/registo/processador',
  },
  {
    id: 'transportador',
    nome: 'Transportador',
    descricao: 'Transporte grandes volumes',
    icon: Truck,
    link: '/registo/transportador',
  },
]

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function RegistoPerfis() {
  const router = useRouter()

  const abrirPerfil = (link: string) => {
    router.push(link)
  }

  return (
    <section className="w-full px-4 py-6">
      {/* =====================================================
          CONTAINER GERAL ÚNICO
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          rounded-3xl
          border
          border-[#e7d5b8]
          bg-white
          px-4
          py-7
          shadow-sm
          sm:px-8
          sm:py-9
        "
      >
        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-8 text-center">
          <h2
            className="
              text-xl
              font-extrabold
              tracking-tight
              text-[#422006]
              sm:text-2xl
            "
          >
            Criar uma conta
          </h2>

          <p
            className="
              mt-2
              text-sm
              font-medium
              text-[#78716c]
              sm:text-base
            "
          >
            Escolha o seu perfil na plataforma
          </p>
        </div>

        {/* =================================================
            PERFIS — 3 COLUNAS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-3
            gap-x-1
            gap-y-6
            sm:gap-x-6
            sm:gap-y-10
          "
        >
          {PERFIS.map((perfil) => {
            const Icone = perfil.icon

            return (
              <button
                key={perfil.id}
                type="button"
                onClick={() => abrirPerfil(perfil.link)}
                aria-label={`Registar como ${perfil.nome}`}
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  items-center
                  rounded-2xl
                  px-1
                  py-3
                  text-center
                  transition-all
                  duration-300
                  hover:bg-[#f0fdf4]
                  active:scale-95
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#166534]
                  focus-visible:ring-offset-2
                  sm:px-2
                "
              >
                {/* =================================================
                    ÍCONE CIRCULAR
                ================================================= */}

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#bbd7a8]
                    bg-[#ecf7e5]
                    text-[#166534]
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:border-[#86a873]
                    group-hover:bg-[#dcfce7]
                    sm:h-20
                    sm:w-20
                  "
                >
                  <Icone
                    size={26}
                    strokeWidth={1.8}
                    className="sm:h-9 sm:w-9"
                  />
                </div>

                {/* =================================================
                    NOME DO PERFIL
                ================================================= */}

                <h3
                  className="
                    mt-3
                    text-[11px]
                    font-extrabold
                    leading-tight
                    text-[#422006]
                    sm:text-base
                  "
                >
                  {perfil.nome}
                </h3>

                {/* =================================================
                    DESCRIÇÃO
                ================================================= */}

                <p
                  className="
                    mt-1.5
                    max-w-[150px]
                    text-[9px]
                    font-medium
                    leading-relaxed
                    text-[#78716c]
                    sm:text-xs
                  "
                >
                  {perfil.descricao}
                </p>

                {/* =================================================
                    INDICAÇÃO DE CLIQUE
                ================================================= */}

                <span
                  className="
                    mt-2
                    text-[9px]
                    font-bold
                    text-[#166534]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    sm:text-[11px]
                  "
                >
                  Registar
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}