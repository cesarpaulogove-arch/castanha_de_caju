
'use client'

import { useState } from 'react'
import {
  ShoppingCart,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import Banner from './Banner'
import Catalogo from './Catalogo'
import Carrinho from './Carrinho'
import MapaEntrega from './MapaEntrega'
import { AuthProvider } from '../AuthContext'
import RegistoPerfis from './RegistoPerfis'

// ============================================================
// BOTÃO DE CASTANHAS NÃO PROCESSADAS
// ============================================================

function BotaoGrandesVolumes() {
  const router = useRouter()

  const abrirPaginaGrandesVolumes = () => {
    router.push('/grandes-volumes')
  }

  return (
    <div className="w-full shrink-0">
      <button
        type="button"
        onClick={abrirPaginaGrandesVolumes}
        className="
          group
          w-full
          cursor-pointer
          rounded-2xl
          border-2
          border-[#e7d5b8]
          bg-white
          px-3
          py-3
          text-left
          shadow-sm
          transition-all
          duration-300
          hover:border-[#86a873]
          hover:bg-[#f0fdf4]
          hover:shadow-md
          active:scale-[0.98]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          {/* ==================================================
              ÍCONE + TEXTO
          ================================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            {/* ÍCONE */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#166534]
                text-white
                shadow-sm
                transition-all
                duration-300
                group-hover:bg-[#14532d]
                group-hover:shadow-md
              "
            >
              <ShoppingCart
                size={20}
                strokeWidth={2.5}
              />
            </div>

            {/* TEXTO */}

            <div className="min-w-0">
              <div
                className="
                  text-sm
                  font-extrabold
                  leading-tight
                  text-[#422006]
                "
              >
                Castanhas não processadas
              </div>

              <div
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  leading-tight
                  text-[#78716c]
                "
              >
                Compre em grandes volumes diretamente
              </div>
            </div>
          </div>

          {/* ==================================================
              SETA
          ================================================== */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#dcfce7]
              text-[#166534]
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:bg-[#166534]
              group-hover:text-white
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
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function LojaCastanhasEcraUnico() {
  const [
    itensCarrinho,
    setItensCarrinho,
  ] = useState<
    {
      produtoId: string
      quantidade: number
    }[]
  >([])

  const [
    medidorSelecionado,
    setMedidorSelecionado,
  ] = useState<
    'copo' | 'balde-medio' | 'balde-grande'
  >('copo')

  // ============================================================
  // OBTER QUANTIDADE
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
  // VERIFICAR PRODUTOS
  // ============================================================

  const temProdutos = itensCarrinho.some(
    item => item.quantidade > 0
  )

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  return (
    <AuthProvider>
      <main
        className="
          relative
          flex
          min-h-screen
          w-full
          flex-col
          overflow-y-auto
          bg-[#fff8e8]
          p-3
          pb-24
          pt-2
          text-[#422006]
          select-none
          md:p-4
          md:pt-2
          lg:h-screen
          lg:overflow-hidden
        "
      >
        {/* ======================================================
            ZONA PRINCIPAL
        ======================================================= */}

        <div
          className="
            relative
            mt-0
            min-h-0
            w-full
            flex-1
            lg:overflow-hidden
          "
        >
          {/* ====================================================
              SECTOR ESQUERDO
          ===================================================== */}

          <div
            className="
              flex
              h-full
              min-h-0
              w-full
              flex-col
              space-y-4
              lg:overflow-hidden
              lg:pr-[calc(33.333%-0.25rem)]
            "
          >
            {/* ==================================================
                BANNER
            ================================================== */}

            <div className="hidden shrink-0 md:block">
              <Banner />
            </div>

            {/* ==================================================
                MAPA + CATÁLOGO
            ================================================== */}

            <div
              className="
                flex
                min-h-0
                w-full
                flex-1
                flex-col
                items-start
                gap-4
                sm:flex-row
              "
            >
              {/* =================================================
                  MAPA
              ================================================= */}

              <div
                className="
                  min-h-0
                  w-full
                  min-w-0
                  flex-1
                "
              >
                <MapaEntrega
                  latitudeCliente={-25.9650}
                  longitudeCliente={32.5850}
                />
              </div>

              {/* =================================================
                  CATÁLOGO + BOTÃO
              ================================================= */}

              <div
                className="
                  flex
                  w-full
                  shrink-0
                  flex-col
                  gap-3
                  sm:max-w-[280px]
                "
              >
                {/* =================================================
                    CATÁLOGO
                ================================================= */}

                <Catalogo
                  obterQuantidade={obterQuantidade}
                  incrementarProduto={incrementarProduto}
                  decrementarProduto={decrementarProduto}
                  medidorSelecionado={medidorSelecionado}
                  setMedidorSelecionado={
                    setMedidorSelecionado
                  }
                />

                {/* =================================================
                    BOTÃO QUANDO NÃO EXISTEM PRODUTOS
                ================================================= */}

                {!temProdutos && (
                  <BotaoGrandesVolumes />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            CARRINHO + BOTÃO
            QUANDO EXISTEM PRODUTOS
        ======================================================= */}

        {temProdutos && (
          <div
            className="
              mt-4
              flex
              w-full
              flex-col
              gap-4
              lg:fixed
              lg:right-4
              lg:top-4
              lg:z-50
              lg:max-h-[calc(100vh-2rem)]
              lg:w-[calc(33.333vw-2rem)]
              lg:max-w-[520px]
            "
          >
            {/* ==================================================
                CARRINHO
            ================================================== */}

            <div
              className="
                min-h-0
                w-full
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

            {/* ==================================================
                BOTÃO DEPOIS DO CARRINHO
            ================================================== */}

            <BotaoGrandesVolumes />
          </div>
        )}

        {/* ======================================================
            REGISTO DE PERFIS
        ======================================================= */}

        <RegistoPerfis />
      </main>
    </AuthProvider>
  )
}