
'use client'

import {
  Check,
  ShoppingCart,
} from 'lucide-react'

interface MedidorGrandeVolume {
  id: string
  nome: string
  quantidade: number
  unidade: 'kg' | 'ton'
  descricao: string
  imagem: string
  preco: number
}

interface CardGrandeVolumeProps {
  medidor: MedidorGrandeVolume
  selecionado: boolean
  onSelecionar: () => void
}

export default function CardGrandeVolume({
  medidor,
  selecionado,
  onSelecionar,
}: CardGrandeVolumeProps) {

  const mostrarQuantidade = () => {
    if (medidor.quantidade >= 1000) {
      const toneladas = medidor.quantidade / 1000

      return `${toneladas} ${
        toneladas === 1
          ? 'tonelada'
          : 'toneladas'
      }`
    }

    return `${medidor.quantidade} kg`
  }

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        transition-all
        duration-200
        ${
          selecionado
            ? 'border-green-500 ring-2 ring-green-500/20 shadow-md'
            : 'border-gray-200 hover:border-green-500/40 hover:shadow-lg'
        }
      `}
    >

      {/* CHECK */}
      {selecionado && (
        <div
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-green-600
            text-white
            shadow-md
          "
        >
          <Check size={15} strokeWidth={3} />
        </div>
      )}

      {/* IMAGEM DO PRODUTO */}
      <div
        className="
          flex
          h-48
          w-full
          items-center
          justify-center
          bg-white
          p-4
        "
      >
        <img
          src={medidor.imagem}
          alt={medidor.nome}
          className="
            max-h-full
            max-w-full
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* INFORMAÇÕES */}
      <div className="px-4 pb-4">

        {/* PRODUTO */}
        <h3
          className="
            text-base
            font-bold
            leading-tight
            text-gray-900
          "
        >
          {medidor.nome}
        </h3>

        {/* QUANTIDADE */}
        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          {mostrarQuantidade()}
        </p>

        {/* PREÇO + CARRINHO */}
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
          "
        >

          {/* PREÇO */}
          <span
            className="
              text-lg
              font-black
              text-green-700
            "
          >
            {medidor.preco.toLocaleString('pt-MZ')} MT
          </span>

          {/* CARRINHO */}
          <button
            type="button"
            onClick={onSelecionar}
            aria-label={`Adicionar ${medidor.nome} ao carrinho`}
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              transition-all
              ${
                selecionado
                  ? 'bg-green-600 text-white'
                  : 'bg-green-700 text-white hover:bg-green-800 hover:scale-105 active:scale-95'
              }
            `}
          >
            {selecionado ? (
              <Check
                size={19}
                strokeWidth={3}
              />
            ) : (
              <ShoppingCart
                size={19}
                strokeWidth={2.5}
              />
            )}
          </button>

        </div>

      </div>

    </article>
  )
}

