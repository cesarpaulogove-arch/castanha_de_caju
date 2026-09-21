'use client'

import {
  ArrowLeft,
  LogIn,
  UserPlus,
  Sprout,
  ShoppingBag,
  Bike,
  Package,
  Factory,
  Truck,
} from 'lucide-react'

import { useRouter } from 'next/navigation'

type Perfil =
  | 'produtor'
  | 'cliente'
  | 'entregador'
  | 'fornecedor'
  | 'processador'
  | 'transportador'

interface Props {
  tipo: string
  perfil: Perfil
  descricao: string
}

const ICONES: Record<Perfil, typeof Sprout> = {
  produtor: Sprout,
  cliente: ShoppingBag,
  entregador: Bike,
  fornecedor: Package,
  processador: Factory,
  transportador: Truck,
}

export default function EscolhaAcessoPerfil({
  tipo,
  perfil,
  descricao,
}: Props) {
  const router = useRouter()

  const Icone = ICONES[perfil]

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-8">
      <div className="mx-auto w-full max-w-md">

        <button
          type="button"
          onClick={() => router.back()}
          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#166534]
            transition
            hover:text-[#14532d]
          "
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div
          className="
            rounded-3xl
            border
            border-[#e7d5b8]
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          {/* Ícone */}
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-2
                border-[#bbd7a8]
                bg-[#ecf7e5]
                text-[#166534]
              "
            >
              <Icone
                size={38}
                strokeWidth={1.8}
              />
            </div>

            <h1
              className="
                mt-5
                text-2xl
                font-extrabold
                text-[#422006]
              "
            >
              {tipo}
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-[#78716c]
              "
            >
              {descricao}
            </p>
          </div>

          {/* Botões */}
          <div className="mt-8 space-y-3">

            <button
              type="button"
              onClick={() =>
                router.push(`/registo/${perfil}/criar`)
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-[#166534]
                px-5
                py-4
                text-sm
                font-extrabold
                text-white
                transition
                hover:bg-[#14532d]
                active:scale-[0.98]
              "
            >
              <UserPlus size={20} />
              Criar conta
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(`/registo/${perfil}/entrar`)
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-[#166534]
                bg-white
                px-5
                py-4
                text-sm
                font-extrabold
                text-[#166534]
                transition
                hover:bg-[#f0fdf4]
                active:scale-[0.98]
              "
            >
              <LogIn size={20} />
              Entrar
            </button>

          </div>

          <p
            className="
              mt-6
              text-center
              text-xs
              leading-relaxed
              text-[#78716c]
            "
          >
            A sua conta será independente e associada ao
            perfil de {tipo.toLowerCase()}.
          </p>

        </div>
      </div>
    </main>
  )
}