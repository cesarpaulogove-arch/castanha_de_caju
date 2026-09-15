'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const PRECO_BASE_COPO = 175.90

// =====================================================
// TIPOS
// =====================================================

interface Medidor {
  id: 'copo' | 'balde-medio' | 'balde-grande'
  name: string
  image: string
  equivaleA: number
}

// =====================================================
// MEDIDORES
// =====================================================

const MEDIDORES: Medidor[] = [
  {
    id: 'copo',
    name: 'Copo',
    image: '/copo.png',
    equivaleA: 1,
  },
  {
    id: 'balde-medio',
    name: 'B. Médio',
    image: '/baldemedio.png',
    equivaleA: 10,
  },
  {
    id: 'balde-grande',
    name: 'B. Grande',
    image: '/baldegrande.png',
    equivaleA: 40,
  },
]

// =====================================================
// PROPS
// =====================================================

interface CatalogoProps {
  obterQuantidade: (id: string) => number

  incrementarProduto: (
    id: string,
    vezes: number
  ) => void

  decrementarProduto: (
    id: string,
    vezes: number
  ) => void

  medidorSelecionado:
    | 'copo'
    | 'balde-medio'
    | 'balde-grande'

  setMedidorSelecionado: (
    id:
      | 'copo'
      | 'balde-medio'
      | 'balde-grande'
  ) => void
}

// =====================================================
// COMPONENTE
// =====================================================

export default function Catalogo({
  obterQuantidade,
  incrementarProduto,
  decrementarProduto,
  medidorSelecionado,
  setMedidorSelecionado,
}: CatalogoProps) {

  // ===================================================
  // PRODUTO
  // ===================================================

  const produtoIdFixo = '1'

  // ===================================================
  // QUANTIDADE
  // ===================================================

  const qtdTotal =
    obterQuantidade(produtoIdFixo)

  // ===================================================
  // MEDIDOR ATIVO
  // ===================================================

  const medidorAtivo =
    MEDIDORES.find(
      (m) => m.id === medidorSelecionado
    ) || MEDIDORES[0]

  // ===================================================
  // PREÇO
  // ===================================================

  const precoDinamico =
    PRECO_BASE_COPO *
    medidorAtivo.equivaleA

  // ===================================================
  // FORMATAR PREÇO
  // ===================================================

  const formataPreco = (
    valor: number
  ) => {

    return new Intl.NumberFormat(
      'de-DE',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(valor)
  }

  // ===================================================
  // CALCULAR VISUALIZAÇÃO
  // ===================================================

  const calcularVisualizacaoGrafica = (
    total: number
  ) => {

    let restante = total

    const baldesGrandes =
      Math.floor(restante / 40)

    restante %= 40

    const baldesMedios =
      Math.floor(restante / 10)

    restante %= 10

    const copos = restante

    return {
      baldesGrandes,
      baldesMedios,
      copos,
    }
  }

  // ===================================================
  // VISUALIZAÇÃO
  // ===================================================

  const visualizacao =
    calcularVisualizacaoGrafica(qtdTotal)

  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="-mt-0 w-full flex flex-col gap-3">


      {/* ============================================= */}
      {/* CARDS DOS MEDIDORES */}
      {/* ============================================= */}

      <div className="grid grid-cols-3 gap-2 w-full">

        {MEDIDORES.map((m) => {

          const preco =
            PRECO_BASE_COPO *
            m.equivaleA

          const selecionado =
            medidorSelecionado === m.id

          return (

            <button
              key={m.id}
              type="button"

              onClick={() =>
                setMedidorSelecionado(m.id)
              }

              className={`
                relative
                min-h-[125px]
                rounded-xl
                border
                p-3

                flex
                flex-col

                items-center
                justify-between

                transition-all
                duration-200

                active:scale-95

                ${
                  selecionado
                    ? `
                      bg-white
                      border-amber-500
                      ring-2
                      ring-amber-500/20
                      shadow-lg
                    `
                    : `
                      bg-[#f5f5f5]
                      border-gray-200
                      hover:bg-white
                      hover:shadow-md
                    `
                }
              `}
            >


              {/* INDICADOR DE SELEÇÃO */}

              {selecionado && (

                <div
                  className="
                    absolute
                    top-2
                    right-2

                    w-2.5
                    h-2.5

                    rounded-full

                    bg-amber-500
                  "
                />

              )}


              {/* IMAGEM */}

              <div
                className="
                  relative

                  w-12
                  h-12

                  sm:w-14
                  sm:h-14
                "
              >

                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-contain"
                />

              </div>


              {/* NOME */}

              <span
                className={`
                  text-[11px]
                  sm:text-xs

                  font-black

                  text-center

                  ${
                    selecionado
                      ? 'text-amber-600'
                      : 'text-gray-700'
                  }
                `}
              >

                {m.name}

              </span>


              {/* PREÇO */}

              <span
                className={`
                  text-[9px]
                  sm:text-[10px]

                  font-black

                  text-center

                  ${
                    selecionado
                      ? 'text-amber-600'
                      : 'text-gray-600'
                  }
                `}
              >

                {formataPreco(preco)} MT

              </span>


            </button>

          )

        })}

      </div>


      {/* ============================================= */}
      {/* PAINEL DE CONTROLO */}
      {/* ============================================= */}

      <div
        className="
          w-full

          bg-[#161616]

          border
          border-white/5

          rounded-xl

          p-3

          flex
          flex-col

          gap-3
        "
      >


        {/* =========================================== */}
        {/* CONTROLO DE QUANTIDADE */}
        {/* =========================================== */}

        {qtdTotal > 0 ? (

          <div
            className="
              flex

              items-center
              justify-between

              bg-black/40

              border
              border-white/5

              rounded-lg

              p-1

              w-full

              h-11
            "
          >


            {/* DIMINUIR */}

            <button
              type="button"

              onClick={() =>
                decrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }

              className="
                w-11

                h-full

                hover:bg-white/5

                rounded

                text-gray-400

                hover:text-white

                flex

                items-center
                justify-center

                transition-all
              "
            >

              <Minus className="w-4 h-4" />

            </button>


            {/* QUANTIDADE */}

            <div
              className="
                flex

                flex-col

                items-center
                justify-center
              "
            >

              <span
                className="
                  text-base

                  font-black

                  text-amber-400
                "
              >

                {qtdTotal} un.

              </span>


              <span
                className="
                  text-[9px]

                  text-gray-500
                "
              >

                {(qtdTotal * 0.5).toFixed(1)} KG

              </span>


            </div>


            {/* AUMENTAR */}

            <button
              type="button"

              onClick={() =>
                incrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }

              className="
                w-11

                h-full

                hover:bg-white/5

                rounded

                text-gray-400

                hover:text-amber-500

                flex

                items-center
                justify-center

                transition-all
              "
            >

              <Plus className="w-4 h-4" />

            </button>


          </div>

        ) : (

          <button
            type="button"

            onClick={() =>
              incrementarProduto(
                produtoIdFixo,
                medidorAtivo.equivaleA
              )
            }

            className="
              w-full

              h-11

              bg-[#222]

              border
              border-white/5

              rounded-lg

              text-gray-300

              hover:text-amber-500

              hover:bg-[#2a2a2a]

              transition-all

              flex

              items-center
              justify-center

              gap-2

              text-xs

              font-bold
            "
          >

            <ShoppingCart className="w-4 h-4" />

            Adicionar

          </button>

        )}


        {/* =========================================== */}
        {/* CARGA REAL */}
        {/* =========================================== */}

        {qtdTotal > 0 && (

          <div
            className="
              w-full

              bg-black/30

              border
              border-white/5

              rounded-lg

              p-2

              flex
              flex-col

              gap-2
            "
          >


            {/* CABEÇALHO */}

            <div
              className="
                w-full

                flex

                items-center
                justify-between

                text-[9px]

                font-black

                text-gray-500

                uppercase

                tracking-wider
              "
            >

              <span>
                Carga Real
              </span>


              <span className="text-amber-500">

                {(qtdTotal * 0.5).toFixed(1)} KG

              </span>


            </div>


            {/* VISUALIZAÇÃO */}

            <div
              className="
                w-full

                flex

                flex-wrap

                gap-2

                items-center
                justify-start

                p-2

                bg-black/20

                rounded

                min-h-[64px]

                max-h-[140px]

                overflow-y-auto

                scrollbar-none
              "
            >


              {/* BALDES GRANDES */}

              {Array.from({
                length:
                  visualizacao.baldesGrandes,
              }).map((_, i) => (

                <div
                  key={`bg-${i}`}

                  className="
                    relative

                    w-9
                    h-9

                    shrink-0

                    transition-transform

                    hover:scale-105
                  "
                >

                  <Image
                    src="/baldegrande.png"
                    alt="Balde grande"
                    fill
                    className="object-contain"
                  />

                </div>

              ))}


              {/* BALDES MÉDIOS */}

              {Array.from({
                length:
                  visualizacao.baldesMedios,
              }).map((_, i) => (

                <div
                  key={`bm-${i}`}

                  className="
                    relative

                    w-8
                    h-8

                    shrink-0

                    transition-transform

                    hover:scale-105
                  "
                >

                  <Image
                    src="/baldemedio.png"
                    alt="Balde médio"
                    fill
                    className="object-contain"
                  />

                </div>

              ))}


              {/* COPOS */}

              {Array.from({
                length:
                  visualizacao.copos,
              }).map((_, i) => (

                <div
                  key={`cp-${i}`}

                  className="
                    relative

                    w-6
                    h-6

                    shrink-0

                    transition-transform

                    hover:scale-105
                  "
                >

                  <Image
                    src="/copo.png"
                    alt="Copo"
                    fill
                    className="object-contain"
                  />

                </div>

              ))}


            </div>


          </div>

        )}


      </div>


    </div>

  )

}