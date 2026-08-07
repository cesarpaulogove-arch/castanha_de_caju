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
  { id: 'copo', name: 'Copo', kg: '0.5kg', image: '/copo.png', equivaleA: 1 },
  { id: 'balde-medio', name: 'B. Médio', kg: '5kg', image: '/baldemedio.png', equivaleA: 10 },
  { id: 'balde-grande', name: 'B. Grande', kg: '20kg', image: '/baldegrande.png', equivaleA: 40 },
]

interface CatalogoProps {
  obterQuantidade: (id: string) => number
  incrementarProduto: (id: string, vezes: number) => void
  decrementarProduto: (id: string, vezes: number) => void
  medidorSelecionado: 'copo' | 'balde-medio' | 'balde-grande'
  setMedidorSelecionado: (id: 'copo' | 'balde-medio' | 'balde-grande') => void
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

  const medidorAtivo = MEDIDORES.find(m => m.id === medidorSelecionado) || MEDIDORES[0]
  const precoDinamico = PRECO_BASE_COPO * medidorAtivo.equivaleA

  // Função idêntica à do carrinho para garantir ponto nos milhares e vírgula nos cêntimos
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
    return { baldesGrandes, baldesMedios, copos: restante % 10 }
  }

  const visualizacao = calcularVisualizacaoGrafica(qtdTotal)

  return (
    <div className="max-w-[280px] w-full flex flex-col min-h-0 space-y-2">
      <h2 className="text-[10px] font-bold text-gray-500 tracking-wider uppercase shrink-0">Catálogo</h2>
      
      <div className="bg-[#161616] border border-white/5 rounded-xl p-3 flex flex-col gap-3 hover:border-white/10 transition-all shrink-0">
        
        {/* TOP: IMAGEM PRINCIPAL BEM MAIOR, SELEÇÃO E INFOS */}
        <div className="flex gap-3 items-start w-full">
          <div className="flex flex-col gap-1.5 shrink-0 items-center">
            {/* Aumentado para w-24 h-24 para total destaque visual do produto */}
            <div className="relative w-24 h-24 bg-black/40 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
              <Image 
                src={medidorAtivo.image} 
                alt={medidorAtivo.name} 
                fill 
                className="object-contain p-2" 
              />
            </div>
            
            {/* Seletores 1, 2, 3 na base da nova imagem */}
            <div className="flex gap-0.5 bg-black/50 p-0.5 rounded border border-white/5 w-full justify-center">
              {MEDIDORES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMedidorSelecionado(m.id)}
                  className={`text-[10px] font-black w-6 h-5 flex items-center justify-center rounded transition-all ${
                    medidorSelecionado === m.id ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {m.id === 'copo' ? '1' : m.id === 'balde-medio' ? '2' : '3'}
                </button>
              ))}
            </div>
          </div>

          {/* Dados Textuais Simétricos com a Altura da Imagem */}
          <div className="flex flex-col justify-between h-30 flex-1 min-w-0 py-1">
            <div>
              <h3 className="text-sm font-black text-white leading-tight tracking-tight break-words">
                Castanha de Caju
              </h3>
              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded mt-2 inline-block uppercase tracking-wider">
                {medidorAtivo.name} ({medidorAtivo.kg})
              </span>
            </div>
            <p className="text-sm font-black text-amber-500 tracking-wide mt-2">
              {formataPreco(precoDinamico)} MT
            </p>
          </div>
        </div>

        {/* BOTTOM: CONTROLADORES */}
        <div className="w-full pt-1 border-t border-white/5">
          {qtdTotal > 0 ? (
            <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg p-1 w-full h-8">
              <button onClick={() => decrementarProduto(produtoIdFixo, medidorAtivo.equivaleA)} className="w-7 h-full hover:bg-white/5 rounded text-gray-400 hover:text-white flex items-center justify-center">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-black text-amber-400">{qtdTotal} un.</span>
              <button onClick={() => incrementarProduto(produtoIdFixo, medidorAtivo.equivaleA)} className="w-7 h-full hover:bg-white/5 rounded text-gray-400 hover:text-white flex items-center justify-center">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => incrementarProduto(produtoIdFixo, medidorAtivo.equivaleA)} 
              className="w-full h-8 bg-[#222] border border-white/5 rounded-lg text-gray-300 hover:text-amber-500 hover:bg-[#2a2a2a] transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              <ShoppingCart className="w-3 h-3" /> Adicionar
            </button>
          )}
        </div>

        {/* PAINEL GRÁFICO: IMAGENS DA CARGA REAL AMPLIADAS */}
        {qtdTotal > 0 && (
          <div className="w-full bg-black/30 border border-white/5 rounded-lg p-2 flex flex-col gap-1.5 mt-1">
            <div className="w-full flex items-center justify-between text-[9px] font-black text-gray-500 uppercase tracking-wider">
              <span>Carga Real</span>
              <span className="text-amber-500">{(qtdTotal * 0.5).toFixed(1)} KG</span>
            </div>
            {/* Aumentámos a escala dos itens gerados para que os baldes e copos fiquem volumosos e bem identificáveis */}
            <div className="w-full flex flex-wrap gap-2 items-center justify-start p-2 bg-black/20 rounded min-h-[64px] max-h-[140px] overflow-y-auto scrollbar-none">
              {Array.from({ length: visualizacao.baldesGrandes }).map((_, i) => (
                <div key={`bg-${i}`} className="relative w-9 h-9 shrink-0 transition-transform hover:scale-105">
                  <Image src="/baldegrande.png" alt="BG" fill className="object-contain" />
                </div>
              ))}
              {Array.from({ length: visualizacao.baldesMedios }).map((_, i) => (
                <div key={`bm-${i}`} className="relative w-8 h-8 shrink-0 transition-transform hover:scale-105">
                  <Image src="/baldemedio.png" alt="BM" fill className="object-contain" />
                </div>
              ))}
              {Array.from({ length: visualizacao.copos }).map((_, i) => (
                <div key={`cp-${i}`} className="relative w-6 h-6 shrink-0 transition-transform hover:scale-105">
                  <Image src="/copo.png" alt="CP" fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
