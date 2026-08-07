'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

const PRECO_BASE_COPO = 175.90

interface Medidor {
  id: 'copo' | 'balde-medio' | 'balde-grande'
  name: string
  kg: string
  image: string
  equivaleA: number
}

const MEDIDORES: Medidor[] = [
  {
    id: 'copo',
    name: 'Copo',
    kg: '0.5kg',
    image: '/copo.png',
    equivaleA: 1
  },
  {
    id: 'balde-medio',
    name: 'B. Médio',
    kg: '5kg',
    image: '/baldemedio.png',
    equivaleA: 10
  },
  {
    id: 'balde-grande',
    name: 'B. Grande',
    kg: '20kg',
    image: '/baldegrande.png',
    equivaleA: 40
  }
]

interface CatalogoProps {
  obterQuantidade: (id: string) => number
  incrementarProduto: (id: string, vezes: number) => void
  decrementarProduto: (id: string, vezes: number) => void
  medidorSelecionado: 'copo' | 'balde-medio' | 'balde-grande'
  setMedidorSelecionado: (
    id: 'copo' | 'balde-medio' | 'balde-grande'
  ) => void
}

export default function Catalogo({
  obterQuantidade,
  incrementarProduto,
  decrementarProduto,
  medidorSelecionado,
  setMedidorSelecionado
}: CatalogoProps) {

  const produtoIdFixo = '1'

  const qtdTotal = obterQuantidade(produtoIdFixo)

  const medidorAtivo =
    MEDIDORES.find(
      (m) => m.id === medidorSelecionado
    ) || MEDIDORES[0]

  const precoDinamico =
    PRECO_BASE_COPO * medidorAtivo.equivaleA

  const formataPreco = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
  }

  const calcularVisualizacaoGrafica = (total: number) => {

    let restante = total

    const baldesGrandes = Math.floor(restante / 40)

    restante %= 40

    const baldesMedios = Math.floor(restante / 10)

    return {
      baldesGrandes,
      baldesMedios,
      copos: restante % 10
    }
  }

  const visualizacao =
    calcularVisualizacaoGrafica(qtdTotal)

  return (

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
        hover:border-white/10
        transition-all
      "
    >

      {/* PRODUTO */}
      <div className="flex gap-3 items-center w-full">

        {/* IMAGEM + SELETOR */}
        <div className="flex flex-col gap-1.5 shrink-0 items-center">

          <div
            className="
              relative
              w-20
              h-20
              sm:w-24
              sm:h-24
              bg-black/40
              rounded-lg
              border
              border-white/5
              flex
              items-center
              justify-center
              overflow-hidden
              shadow-inner
            "
          >

            <Image
              src={medidorAtivo.image}
              alt={medidorAtivo.name}
              fill
              className="object-contain p-2"
            />

          </div>

          {/* SELETORES */}
          <div
            className="
              flex
              gap-0.5
              bg-black/50
              p-0.5
              rounded
              border
              border-white/5
              w-full
              justify-center
            "
          >

            {MEDIDORES.map((m) => (

              <button
                key={m.id}
                onClick={() =>
                  setMedidorSelecionado(m.id)
                }
                className={`
                  text-[10px]
                  font-black
                  w-6
                  h-5
                  flex
                  items-center
                  justify-center
                  rounded
                  transition-all
                  ${
                    medidorSelecionado === m.id
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }
                `}
              >

                {m.id === 'copo'
                  ? '1'
                  : m.id === 'balde-medio'
                    ? '2'
                    : '3'}

              </button>

            ))}

          </div>

        </div>


        {/* INFORMAÇÕES */}
   <div className="flex flex-col justify-between flex-1 min-w-0 ml-19 sm:ml-0">

          <div>

            <h3
              className="
                text-sm
                font-black
                text-white
                leading-tight
                tracking-tight
              "
            >
              Castanha de Caju
            </h3>

            <span
              className="
                text-[9px]
                font-bold
                text-amber-500
                bg-amber-500/10
                px-1.5
                py-0.5
                rounded
                mt-1
                inline-block
                uppercase
                tracking-wider
              "
            >
              {medidorAtivo.name} ({medidorAtivo.kg})
            </span>

          </div>

          <p
            className="
              text-sm
              font-black
              text-amber-500
              tracking-wide
              mt-2
            "
          >
            {formataPreco(precoDinamico)} MT
          </p>

        </div>

      </div>


      {/* CONTROLO DE QUANTIDADE */}
      <div className="w-full pt-1 border-t border-white/5">

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
              h-8
            "
          >

            <button
              onClick={() =>
                decrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }
              className="
                w-7
                h-full
                hover:bg-white/5
                rounded
                text-gray-400
                hover:text-white
                flex
                items-center
                justify-center
              "
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="text-xs font-black text-amber-400">
              {qtdTotal} un.
            </span>

            <button
              onClick={() =>
                incrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }
              className="
                w-7
                h-full
                hover:bg-white/5
                rounded
                text-gray-400
                hover:text-white
                flex
                items-center
                justify-center
              "
            >
              <Plus className="w-3 h-3" />
            </button>

          </div>

        ) : (

          <button
            onClick={() =>
              incrementarProduto(
                produtoIdFixo,
                medidorAtivo.equivaleA
              )
            }
            className="
              w-full
              h-8
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

            <ShoppingCart className="w-3 h-3" />

            Adicionar

          </button>

        )}

      </div>


      {/* CARGA REAL */}
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
            gap-1.5
          "
        >

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
              length: visualizacao.baldesGrandes
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
              length: visualizacao.baldesMedios
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
              length: visualizacao.copos
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
  )
}