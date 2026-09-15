'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface BannerGrandesVolumesProps {
  onSolicitar: () => void
}

const IMAGENS_BANNER = [
  '/senhoras.png',
  '/diango.png',
]

export default function BannerGrandesVolumes({
  onSolicitar,
}: BannerGrandesVolumesProps) {
  const [imagemAtual, setImagemAtual] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((atual) =>
        atual === IMAGENS_BANNER.length - 1
          ? 0
          : atual + 1
      )
    }, 5000)

    return () => clearInterval(intervalo)
  }, [])

  const imagemAnterior = () => {
    setImagemAtual((atual) =>
      atual === 0
        ? IMAGENS_BANNER.length - 1
        : atual - 1
    )
  }

  const proximaImagem = () => {
    setImagemAtual((atual) =>
      atual === IMAGENS_BANNER.length - 1
        ? 0
        : atual + 1
    )
  }

  return (
    <section
      className="
        relative
        h-[260px]
        w-full
        overflow-hidden
        bg-[#fff8e8]
        sm:h-[320px]
        md:h-[400px]
      "
    >

      {/* IMAGENS ROTATIVAS */}
      {IMAGENS_BANNER.map((imagem, index) => (
        <div
          key={imagem}
          className={`
            absolute
            inset-0
            bg-cover
            bg-center
            transition-opacity
            duration-1000
            ${
              imagemAtual === index
                ? 'opacity-100'
                : 'opacity-0'
            }
          `}
          style={{
            backgroundImage: `url('${imagem}')`,
          }}
        />
      ))}

      {/* BOTÃO FAZER PEDIDO */}
      <button
        type="button"
        onClick={onSolicitar}
        className="
          absolute
          bottom-5
          left-5
          z-20
          flex
          items-center
          gap-2
          rounded-xl
          bg-green-700
          px-6
          py-3
          text-sm
          font-black
          text-white
          shadow-xl
          transition-all
          hover:scale-105
          hover:bg-green-800
          active:scale-95
          md:bottom-7
          md:left-7
          md:px-7
          md:py-3.5
        "
      >
        Fazer pedido
        <ArrowRight size={18} />
      </button>

      {/* BOTÃO ANTERIOR */}
      <button
        type="button"
        onClick={imagemAnterior}
        aria-label="Imagem anterior"
        className="
          absolute
          left-3
          top-1/2
          z-20
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-black/30
          text-white
          backdrop-blur-sm
          transition
          hover:bg-black/60
        "
      >
        <ChevronLeft size={21} />
      </button>

      {/* BOTÃO PRÓXIMO */}
      <button
        type="button"
        onClick={proximaImagem}
        aria-label="Próxima imagem"
        className="
          absolute
          right-3
          top-1/2
          z-20
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          bg-black/30
          text-white
          backdrop-blur-sm
          transition
          hover:bg-black/60
        "
      >
        <ChevronRight size={21} />
      </button>

    </section>
  )
}