'use client'

import { useState } from 'react'
import {
  ShoppingCart,
  ArrowRight,
} from 'lucide-react'

import Banner from './Banner'
import Catalogo from './Catalogo'
import Carrinho from './Carrinho'
import MapaEntrega from './MapaEntrega'
import { AuthProvider } from '../AuthContext'

export default function LojaCastanhasEcraUnico() {
  const [itensCarrinho, setItensCarrinho] = useState<
    { produtoId: string; quantidade: number }[]
  >([])

  const [medidorSelecionado, setMedidorSelecionado] = useState<
    'copo' | 'balde-medio' | 'balde-grande'
  >('copo')

  // ============================================================
  // QUANTIDADE DO PRODUTO
  // ============================================================

  const obterQuantidade = (id: string) => {
    return (
      itensCarrinho.find(
        item => item.produtoId === id
      )?.quantidade || 0
    )
  }

  // ============================================================
  // INCREMENTAR PRODUTO
  // ============================================================

  const incrementarProduto = (
    id: string,
    quantidade: number
  ) => {
    setItensCarrinho(prevItens => {
      const itemExistente = prevItens.find(
        item => item.produtoId === id
      )

      if (itemExistente) {
        return prevItens.map(item =>
          item.produtoId === id
            ? {
                ...item,
                quantidade:
                  item.quantidade + quantidade,
              }
            : item
        )
      }

      return [
        ...prevItens,
        {
          produtoId: id,
          quantidade,
        },
      ]
    })
  }

  // ============================================================
  // DECREMENTAR PRODUTO
  // ============================================================

  const decrementarProduto = (
    id: string,
    quantidade: number
  ) => {
    setItensCarrinho(prevItens => {
      const itemExistente = prevItens.find(
        item => item.produtoId === id
      )

      if (!itemExistente) {
        return prevItens
      }

      const novaQuantidade =
        itemExistente.quantidade - quantidade

      if (novaQuantidade <= 0) {
        return prevItens.filter(
          item => item.produtoId !== id
        )
      }

      return prevItens.map(item =>
        item.produtoId === id
          ? {
              ...item,
              quantidade: novaQuantidade,
            }
          : item
      )
    })
  }

  // ============================================================
  // LIMPAR CARRINHO
  // ============================================================

  const aoLimparCarrinho = () => {
    setItensCarrinho([])
  }

  // ============================================================
  // RESETAR CATÁLOGO
  // ============================================================

  const aoResetarCatalogo = () => {
    setItensCarrinho([])
    setMedidorSelecionado('copo')
  }

  // ============================================================
  // VERIFICAR SE EXISTEM PRODUTOS
  // ============================================================

  const temProdutos = itensCarrinho.some(
    item => item.quantidade > 0
  )

  return (
    <AuthProvider>
      <main
        className="
          relative
          w-full
          min-h-screen
          lg:h-screen
          bg-[#111111]
          text-white
          p-3
          md:p-4
          pt-2
          md:pt-2
          pb-24
          flex
          flex-col
          overflow-y-auto
          lg:overflow-hidden
          select-none
        "
      >
        {/* ======================================================
            ZONA PRINCIPAL
        ======================================================= */}

        <div
          className="
            relative
            flex-1
            min-h-0
            w-full
            mt-0
            lg:overflow-hidden
          "
        >
          {/* ====================================================
              SECTOR ESQUERDO
          ===================================================== */}

          <div
            className="
              lg:pr-[calc(33.333%-0.25rem)]
              flex
              flex-col
              min-h-0
              lg:overflow-hidden
              space-y-4
              w-full
              h-full
            "
          >
            {/* ==================================================
                BANNER
            =================================================== */}

            <div className="hidden md:block shrink-0">
              <Banner />
            </div>

            {/* ==================================================
                MAPA + CATÁLOGO
            =================================================== */}

            <div
              className="
                w-full
                flex
                flex-col
                sm:flex-row
                items-start
                gap-4
                flex-1
                min-h-0
              "
            >
              {/* =================================================
                  MAPA
              ================================================= */}

              <div
                className="
                  w-full
                  flex-1
                  min-w-0
                  min-h-0
                "
              >
                <MapaEntrega
                  latitudeCliente={-25.9650}
                  longitudeCliente={32.5850}
                />
              </div>

              {/* =================================================
                  CATÁLOGO
              ================================================= */}

              <div
                className="
                  shrink-0
                  w-full
                  sm:max-w-[280px]
                "
              >
                <Catalogo
                  obterQuantidade={obterQuantidade}
                  incrementarProduto={incrementarProduto}
                  decrementarProduto={decrementarProduto}
                  medidorSelecionado={medidorSelecionado}
                  setMedidorSelecionado={
                    setMedidorSelecionado
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            CARRINHO + BOTÃO
            NO CELULAR: UM DEPOIS DO OUTRO
            NO COMPUTADOR: COLUNA FIXA À DIREITA
        ======================================================= */}

        <div
          className="
            w-full
            mt-4
            flex
            flex-col
            gap-4

            lg:fixed
            lg:z-50
            lg:top-4
            lg:right-4
            lg:bottom-auto
            lg:w-[calc(33.333vw-2rem)]
            lg:max-w-[520px]
            lg:max-h-[calc(100vh-2rem)]
          "
        >
          {/* ====================================================
              CARRINHO
          ===================================================== */}

          {temProdutos && (
            <div
              className="
                w-full
                min-h-0
                lg:max-h-[calc(100vh-190px)]
                lg:overflow-y-auto
                lg:pr-1
              "
            >
              <Carrinho
                itens={itensCarrinho}
                medidorSelecionado={medidorSelecionado}
                aoLimparCarrinho={aoLimparCarrinho}
                aoResetarCatalogo={aoResetarCatalogo}
              />
            </div>
          )}

          {/* ====================================================
              CASTANHAS NÃO PROCESSADAS
              FICA SEMPRE DEPOIS DA CARRINHA
          ===================================================== */}

          <div
            className="
              w-full
              shrink-0
            "
          >
            <button
              type="button"
              onClick={() => {
                window.location.href = '/grandes-volumes'
              }}
              className="
                group
                w-full
                rounded-xl
                border
                border-emerald-500/30
                bg-emerald-500/10
                px-4
                py-3
                text-left
                cursor-pointer
                transition-all
                duration-300
                hover:border-emerald-400/50
                hover:bg-emerald-500/20
                hover:shadow-lg
                hover:shadow-emerald-500/10
                active:scale-[0.99]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                {/* =================================================
                    TEXTO + ÍCONE
                ================================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                >
                  {/* =================================================
                      ÍCONE
                  ================================================== */}

                  <div
                    className="
                      shrink-0
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-500
                      text-white
                      shadow-lg
                      shadow-emerald-500/20
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >
                    <ShoppingCart
                      size={19}
                      strokeWidth={2.3}
                    />
                  </div>

                  {/* =================================================
                      INFORMAÇÃO
                  ================================================== */}

                  <div className="min-w-0">
                    <div
                      className="
                        text-sm
                        font-bold
                        text-white
                        leading-tight
                      "
                    >
                      Castanhas não processadas
                    </div>

                    <div
                      className="
                        mt-1
                        text-xs
                        text-white/60
                        leading-tight
                      "
                    >
                      Compre em grandes volumes diretamente
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SETA
                ================================================== */}

                <div
                  className="
                    shrink-0
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-white
                    transition-all
                    duration-300
                    group-hover:bg-emerald-500
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </AuthProvider>
  )
}