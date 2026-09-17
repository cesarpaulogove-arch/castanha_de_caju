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

  const qtdTotal = obterQuantidade(produtoIdFixo)

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

  // Evita aviso de variável não utilizada
  void precoDinamico

  // ===================================================
  // FORMATAR PREÇO
  // ===================================================

  const formataPreco = (valor: number) => {
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

    <div className="flex w-full flex-col gap-3">

      {/* ============================================= */}
      {/* CARDS DOS MEDIDORES */}
      {/* ============================================= */}

      <div className="grid w-full grid-cols-3 gap-2">

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
              aria-pressed={selecionado}
              className={`
                relative
                flex
                min-h-[135px]
                flex-col
                items-center
                justify-between
                rounded-2xl
                border-2
                p-3
                transition-all
                duration-200
                active:scale-95

                ${
                  selecionado
                    ? `
                      border-[#166534]
                      bg-[#dcfce7]
                      shadow-md
                      ring-2
                      ring-[#166534]/20
                    `
                    : `
                      border-[#e7d5b8]
                      bg-white
                      shadow-sm
                      hover:border-[#86a873]
                      hover:bg-[#f0fdf4]
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
                    right-2
                    top-2
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-[#166534]
                    shadow-sm
                  "
                />

              )}

              {/* IMAGEM */}

              <div
                className="
                  relative
                  h-12
                  w-12
                  sm:h-14
                  sm:w-14
                "
              >

                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="56px"
                  className="object-contain"
                />

              </div>

              {/* NOME */}

              <span
                className={`
                  text-center
                  text-[11px]
                  font-black
                  sm:text-xs

                  ${
                    selecionado
                      ? 'text-[#166534]'
                      : 'text-[#422006]'
                  }
                `}
              >
                {m.name}
              </span>

              {/* PREÇO */}

              <span
                className={`
                  text-center
                  text-[10px]
                  font-extrabold
                  sm:text-xs

                  ${
                    selecionado
                      ? 'text-[#166534]'
                      : 'text-[#92400e]'
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
          flex
          w-full
          flex-col
          gap-3
          rounded-2xl
          border
          border-[#e7d5b8]
          bg-white
          p-3
          shadow-sm
        "
      >

        {/* =========================================== */}
        {/* CONTROLO DE QUANTIDADE */}
        {/* =========================================== */}

        {qtdTotal > 0 ? (

          <div
            className="
              flex
              h-12
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-[#e7d5b8]
              bg-[#fff8e8]
              p-1
            "
          >

            {/* DIMINUIR */}

            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() =>
                decrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                rounded-lg
                text-[#166534]
                transition-all
                hover:bg-[#dcfce7]
                active:scale-95
              "
            >

              <Minus
                className="h-5 w-5"
                strokeWidth={2.5}
              />

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
                  text-[#166534]
                "
              >
                {qtdTotal} un.
              </span>

              <span
                className="
                  text-[10px]
                  font-semibold
                  text-[#78716c]
                "
              >
                {(qtdTotal * 0.5).toFixed(1)} KG
              </span>

            </div>

            {/* AUMENTAR */}

            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() =>
                incrementarProduto(
                  produtoIdFixo,
                  medidorAtivo.equivaleA
                )
              }
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                rounded-lg
                bg-[#166534]
                text-white
                transition-all
                hover:bg-[#14532d]
                active:scale-95
              "
            >

              <Plus
                className="h-5 w-5"
                strokeWidth={2.5}
              />

            </button>

          </div>

        ) : (

          /* ========================================= */
          /* BOTÃO ADICIONAR */
          /* ========================================= */

          <button
            type="button"
            onClick={() =>
              incrementarProduto(
                produtoIdFixo,
                medidorAtivo.equivaleA
              )
            }
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#166534]
              bg-[#166534]
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              hover:bg-[#14532d]
              hover:shadow-md
              active:scale-[0.98]
            "
          >

            <ShoppingCart
              className="h-5 w-5"
              strokeWidth={2.5}
            />

            Adicionar à carrinha

          </button>

        )}

        {/* =========================================== */}
        {/* CARGA REAL */}
        {/* =========================================== */}

        {qtdTotal > 0 && (

          <div
            className="
              flex
              w-full
              flex-col
              gap-2
              rounded-xl
              border
              border-[#e7d5b8]
              bg-[#fff8e8]
              p-2
            "
          >

            {/* CABEÇALHO */}

            <div
              className="
                flex
                w-full
                items-center
                justify-between
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-[#78716c]
              "
            >

              <span>
                Carga real
              </span>

              <span className="text-[#166534]">
                {(qtdTotal * 0.5).toFixed(1)} KG
              </span>

            </div>

            {/* VISUALIZAÇÃO */}

            <div
              className="
                flex
                min-h-[64px]
                max-h-[140px]
                w-full
                flex-wrap
                items-center
                justify-start
                gap-2
                overflow-y-auto
                rounded-lg
                border
                border-[#e7d5b8]
                bg-white
                p-2
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
                    h-9
                    w-9
                    shrink-0
                    transition-transform
                    hover:scale-105
                  "
                >

                  <Image
                    src="/baldegrande.png"
                    alt="Balde grande"
                    fill
                    sizes="36px"
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
                    h-8
                    w-8
                    shrink-0
                    transition-transform
                    hover:scale-105
                  "
                >

                  <Image
                    src="/baldemedio.png"
                    alt="Balde médio"
                    fill
                    sizes="32px"
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
                    h-6
                    w-6
                    shrink-0
                    transition-transform
                    hover:scale-105
                  "
                >

                  <Image
                    src="/copo.png"
                    alt="Copo"
                    fill
                    sizes="24px"
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