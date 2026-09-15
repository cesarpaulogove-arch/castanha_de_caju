'use client'

import { useState } from 'react'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import BannerGrandesVolumes from '../components/BannerGrandesVolumes'
import MedidoresGrandeEscala from '../components/MedidoresGrandeEscala'
import PedidoGrandeVolume from '../components/PedidoGrandeVolume'

export interface MedidorGrandeVolume {
  id: string
  nome: string
  quantidade: number
  unidade: 'kg' | 'ton'
  descricao: string
  imagem: string
  preco: number
}

export const MEDIDORES_GRANDE_ESCALA: MedidorGrandeVolume[] = [
  {
    id: 'lata-grande',
    nome: 'Lata Grande',
    quantidade: 25,
    unidade: 'kg',
    descricao: 'Lata com aproximadamente 25 kg',
    imagem: '/lata.png',
    preco: 12500,
  },
  {
    id: 'saco-50kg',
    nome: 'Saco',
    quantidade: 50,
    unidade: 'kg',
    descricao: 'Saco de 50 kg',
    imagem: '/saco_1.png',
    preco: 24000,
  },
  {
    id: '100kg',
    nome: '100 kg',
    quantidade: 100,
    unidade: 'kg',
    descricao: 'Fornecimento de 100 kg',
    imagem: '/saco_2.png',
    preco: 46000,
  },
  {
    id: '250kg',
    nome: '250 kg',
    quantidade: 250,
    unidade: 'kg',
    descricao: 'Fornecimento de 250 kg',
    imagem: '/saco_5.png',
    preco: 112000,
  },
  {
    id: '500kg',
    nome: '500 kg',
    quantidade: 500,
    unidade: 'kg',
    descricao: 'Fornecimento de 500 kg',
    imagem: '/meia_tonelada.png',
    preco: 210000,
  },
  {
    id: '1ton',
    nome: '1 Tonelada',
    quantidade: 1000,
    unidade: 'kg',
    descricao: '1 tonelada de castanha',
    imagem: '/tonelada.png',
    preco: 400000,
  },
  {
    id: '2ton',
    nome: '2 Toneladas',
    quantidade: 2000,
    unidade: 'kg',
    descricao: '2 toneladas de castanha',
    imagem: '/2ton.png',
    preco: 780000,
  },
  {
    id: '5ton',
    nome: '5 Toneladas',
    quantidade: 5000,
    unidade: 'kg',
    descricao: '5 toneladas de castanha',
    imagem: '/5ton.png',
    preco: 1850000,
  },
  {
    id: '10ton',
    nome: '10 Toneladas',
    quantidade: 10000,
    unidade: 'kg',
    descricao: '10 toneladas de castanha',
    imagem: '/10ton.png',
    preco: 3500000,
  },
  {
    id: '20ton',
    nome: '20 Toneladas',
    quantidade: 20000,
    unidade: 'kg',
    descricao: '20 toneladas de castanha',
    imagem: '/20ton.png',
    preco: 6800000,
  },
]


export default function GrandesVolumesPage() {
  const [selecionado, setSelecionado] =
    useState<MedidorGrandeVolume | null>(null)

  const [mostrarPedido, setMostrarPedido] = useState(false)

  const selecionarVolume = (
    medidor: MedidorGrandeVolume
  ) => {
    setSelecionado(medidor)
    setMostrarPedido(true)
  }

  return (
  <main className="min-h-screen w-full bg-[#fff8e8] text-[#1f2937]">

    {/* BANNER — 100% DA LARGURA DA TELA */}
    <div className="w-full">
      <BannerGrandesVolumes
        onSolicitar={() => {
          setSelecionado(null)
          setMostrarPedido(true)
        }}
      />
    </div>

    {/* RESTANTE DO CONTEÚDO */}
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 md:px-6 lg:px-8">

      {/* VOLTAR */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="
          mb-4
          flex
          items-center
          gap-2
          rounded-lg
          px-2
          py-2
          text-sm
          font-semibold
          text-gray-600
          transition
          hover:bg-green-900/5
          hover:text-green-800
        "
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      {/* TÍTULO */}
      <section className="mt-8">

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-green-700">
              Escolha a quantidade
            </p>
          </div>

          {selecionado && (
            <div
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-green-700/20
                bg-green-700/10
                px-4
                py-2
                text-sm
                md:flex
              "
            >
              <ShoppingCart
                size={17}
                className="text-green-700"
              />

              <span className="font-semibold text-green-900">
                {selecionado.nome}
              </span>
            </div>
          )}

        </div>

        {/* CARTÕES */}
        <MedidoresGrandeEscala
          medidores={MEDIDORES_GRANDE_ESCALA}
          selecionado={selecionado}
          onSelecionar={selecionarVolume}
        />

      </section>

      {/* PEDIDO PERSONALIZADO */}
      <section className="mt-10">

        <div
          className="
            rounded-3xl
            border
            border-green-900/10
            bg-white/70
            p-5
            shadow-sm
            md:p-7
          "
        >

          <button
            type="button"
            onClick={() => {
              setSelecionado(null)
              setMostrarPedido(true)
            }}
            className="
              rounded-xl
              bg-green-700
              px-5
              py-3
              text-sm
              font-black
              text-white
              shadow-sm
              transition
              hover:bg-green-800
              active:scale-[0.98]
            "
          >
             Especifique a quantidade?
          </button>

        </div>

      </section>

    </div>

    {/* MODAL / FORMULÁRIO */}
    {mostrarPedido && (
      <PedidoGrandeVolume
        volumeSelecionado={selecionado}
        onFechar={() => setMostrarPedido(false)}
      />
    )}

  </main>
)
}