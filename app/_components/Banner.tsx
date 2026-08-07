'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// Lista atualizada com o novo slide de desenvolvimento e inovação tecnológica
const CONTEUDO_ROTATIVO = [
  { 
    linha1: 'Castanhas Frescas', 
    linha2: 'Sabor no Ponto', 
    chamada: 'Faça já a tua encomenda',
    imagemDireita: '/castanha_img.jpg' 
  },
  { 
    /* CORRIGIDO: Projetos de robótica e protótipos inteligentes + Castanhas da Mana Aninha */
    linha1: 'Projetos de Robótica e Protótipos Inteligentes', 
    linha2: 'Desenvolvimento Avançado enquanto Saboreia as Castanhas da Diango Aninha', 
    chamada: 'Inovação, Engenharia e Sabor com a Assinatura SIDCode',
    imagemDireita: '/robo.png' 
  },
  { 
    linha1: 'Transformamos e prototipamos ideias em soluções', 
    linha2: 'Enquanto saboreia a deliciosa Castanha da Diango Aninha', 
    chamada: 'Tecnologia e sabor em perfeita harmonia',
    imagemDireita: '/code.png' 
  },
  { 
    linha1: 'Qualidade Premium', 
    linha2: 'Direto de Inhambane', 
    chamada: 'Aproveite a entrega grátis',
    imagemDireita: '/baldegrande.png' 
  }

]

export default function Banner() {
  const [indice, setIndice] = useState(0)

  // Mantido o temporizador confortável de 8 segundos (8000ms) para ler os textos maiores
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % CONTEUDO_ROTATIVO.length)
    }, 8000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="w-full lg:h-44 h-auto min-h-[160px] flex items-center relative overflow-hidden shrink-0 bg-white/[0.01] border border-white/10 rounded-xl shadow-2xl transition-all duration-300">
      
      {/* ESTRUTURA DIVIDIDA BASEADA NO TEU ESBOÇO */}
      <div className="z-10 flex w-full h-full items-center">
        
        {/* COLUNA ESQUERDA: MARCA, ÁGUIA E MANA ANINHA */}
        <div className="flex flex-col items-center justify-between h-full py-4 px-6 shrink-0 select-none w-48 border-r border-white/10">
          
          {/* imagem de aguia */}
          <div className="relative w-20 h-20 transition-transform duration-500 hover:scale-105">
            <Image 
              src="/logo.png" 
              alt="Imagem de Águia" 
              fill
              className="object-contain drop-shadow-[0_4px_12px_rgba(212,255,33,0.15)] animate-pulse [animation-duration:4s]"
              priority
            />
          </div>
          
          {/* sidcode */}
          <div className="flex items-center gap-1 bg-white/[0.02] px-3 py-1 rounded border border-white/5 shadow-sm">
            <span className="text-[11px] font-black tracking-[0.15em] text-gray-300 uppercase">
             
            </span>
          </div>

          {/* castanhas mana aninha */}
          <span className="text-xs font-black tracking-wider text-center text-amber-500 uppercase mt-2 leading-tight">
            CASTANHAS DIANGO ANINHA
          </span>
        </div>

        {/* COLUNA DIREITA: CONTEÚDO DINÂMICO (TEXTOS + IMAGEM VARIÁVEL GIGANTE) */}
        <div className="flex-1 h-full flex items-center justify-between pl-8 pr-4 relative">
          
          {/* Bloco Central de Textos Rotativos */}
          <div className="flex flex-col justify-center relative h-full flex-1 min-w-0 pr-4">
            
            {CONTEUDO_ROTATIVO.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col space-y-2 absolute inset-y-0 left-0 justify-center w-full transition-all duration-1000 ease-in-out ${
                  indice === index 
                    ? 'opacity-100 translate-x-0 pointer-events-auto' 
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
              >
                {/* linha 1 e linha 2 estruturadas */}
                <div className="space-y-0.5">
                  <h2 className="text-base md:text-lg font-black text-white tracking-wide uppercase break-words line-clamp-2">
                    {item.linha1}
                  </h2>
                  <h3 className="text-xs md:text-sm font-bold text-gray-400 tracking-wide uppercase break-words line-clamp-2">
                    {item.linha2}
                  </h3>
                </div>
                
                {/* chamada / texto de instrução na base */}
                <p className="text-xs font-black tracking-wider text-amber-500 uppercase pt-1">
                  {item.chamada}
                </p>
              </div>
            ))}

          </div>

          {/* ESPAÇO DIREITO DA MOLDURA: IMAGEM FLUTUANTE SEM BORDAS */}
          <div className="relative h-full w-48 shrink-0 bg-transparent flex items-center justify-center overflow-hidden pointer-events-none">
            {CONTEUDO_ROTATIVO.map((item, index) => (
              <Image 
                key={index}
                src={item.imagemDireita} 
                alt={`imagem de transicao ${index + 1}`} 
                fill
                className={`object-contain py-2 drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] absolute transition-all duration-1000 ease-in-out ${
                  indice === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    
    </div>
  )
}
