
'use client'

import {
  Check,
  ShoppingCart,
} from 'lucide-react'

import type {
  MedidorGrandeVolume,
} from '../page'

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

  const formatarPreco = (preco: number) => {
    return `${preco.toLocaleString('pt-MZ')} MT`
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
            ? `
              border-green-500
              ring-2
              ring-green-500/20
              shadow-md
            `
            : `
              border-gray-200
              hover:border-green-500/40
              hover:shadow-lg
            `
        }
      `}
    >

      {/* MARCADOR */}
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

      {/* IMAGEM */}
      <div
        className="
          flex
          w-full
          items-center
          justify-center
          bg-white
          px-4
          pt-4
        "
      >
        <div
          className="
            flex
            aspect-square
            w-full
            items-center
            justify-center
            overflow-hidden
          "
        >
          <img
            src={medidor.imagem}
            alt={medidor.nome}
            className="
              h-full
              w-full
              object-contain
              transition-transform
              duration-300
              group-hover:scale-[1.04]
            "
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div
        className="
          px-4
          pb-4
          pt-2
        "
      >

        {/* NOME */}
        <h3
          className="
            truncate
            text-base
            font-extrabold
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
            font-medium
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
            items-end
            justify-between
            gap-3
          "
        >

          {/* PREÇO */}
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-gray-400
              "
            >
              Preço
            </p>

            <p
              className="
                mt-0.5
                whitespace-nowrap
                text-lg
                font-black
                leading-none
                text-green-700
              "
            >
              {formatarPreco(medidor.preco)}
            </p>
          </div>

          {/* CARRINHO */}
          <button
            type="button"
            onClick={onSelecionar}
            aria-label={
              selecionado
                ? `Remover ${medidor.nome}`
                : `Adicionar ${medidor.nome} ao carrinho`
            }
            title={
              selecionado
                ? 'Selecionado'
                : 'Adicionar ao carrinho'
            }
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              transition-all
              duration-200
              ${
                selecionado
                  ? `
                    bg-green-600
                    text-white
                    shadow-md
                  `
                  : `
                    bg-green-700
                    text-white
                    hover:bg-green-800
                    hover:scale-105
                    active:scale-95
                  `
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

