'use client'
import { useState } from 'react'

// Importações com caminhos locais relativos corretos
import Banner from './Banner'
import Catalogo from './Catalogo'
import Carrinho from './Carrinho'
import MapaEntrega from './MapaEntrega'
import { AuthProvider } from '../AuthContext'

const catalogoCastanhas = [
  { id: '1', name: 'Castanha Caju Smash', price: 18.90, unit: '500g', imagePath: '/copo.png' }
]

export default function LojaCastanhasEcraUnico() {
  const [itensCarrinho, setItensCarrinho] = useState<{ produtoId: string; quantidade: number }[]>([])
  const [medidorSelecionado, setMedidorSelecionado] = useState<'copo' | 'balde-medio' | 'balde-grande'>('copo')

  const obterQuantidade = (id: string) => {
    return itensCarrinho.find(item => item.produtoId === id)?.quantidade || 0
  }

  const incrementarProduto = (id: string, vezes: number) => {
    const itemExistente = itensCarrinho.find(item => item.produtoId === id)
    if (itemExistente) {
      setItensCarrinho(itensCarrinho.map(item =>
        item.produtoId === id ? { ...item, quantidade: item.quantidade + vezes } : item
      ))
    } else {
      setItensCarrinho([...itensCarrinho, { produtoId: id, quantidade: vezes }])
    }
  }

  const decrementarProduto = (id: string, vezes: number) => {
    const itemExistente = itensCarrinho.find(item => item.produtoId === id)
    if (!itemExistente) return
    if (itemExistente.quantidade <= vezes) {
      setItensCarrinho(itensCarrinho.filter(item => item.produtoId !== id))
    } else {
      setItensCarrinho(itensCarrinho.map(item =>
        item.produtoId === id ? { ...item, quantidade: item.quantidade - vezes } : item
      ))
    }
  }

  // Função para limpar completamente todos os produtos da carrinha
  const aoLimparCarrinho = () => {
    setItensCarrinho([])
  }

  // Função para resetar as definições do catálogo de volta ao medidor padrão
  const aoResetarCatalogo = () => {
    setMedidorSelecionado('copo')
  }

  return (
    <AuthProvider>
      {/* 
        OTIMIZAÇÃO DE UNIFICAÇÃO DE LAYOUT:
        - Mantido o 'p-3 md:p-4' apenas para as laterais, mas controlado o espaçamento superior.
      */}
      <div className="w-full lg:h-screen min-h-screen bg-[#111111] font-sans text-white p-3 md:p-4 pt-2 md:pt-2 flex flex-col lg:overflow-hidden overflow-y-auto select-none">

        {/* O Cabeçalho (Agora com mb-0 no seu interior) */}


        {/* 
          ZONA DO CONTEÚDO PRINCIPAL:
          - Removido qualquer 'space-y' que empurrasse o Banner para longe do Header.
          - Adicionado 'mt-0' para colar a grelha diretamente à linha do cabeçalho.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 lg:overflow-hidden w-full mt-0">

          {/* SECTOR ESQUERDO + CENTRAL (Banner, Mapa e Catálogo) */}
          <div className="lg:col-span-2 flex flex-col min-h-0 lg:overflow-hidden space-y-4 w-full">

            {/* O Banner fica agora imediatamente abaixo da linha do Header */}
            <div className="hidden md:block">
              <Banner />
            </div>

            {/* MAPA E CATÁLOGO */}
            <div className="w-full flex flex-col sm:flex-row items-start gap-4 flex-1 min-h-0">

              {/* MAPA */}
              <div className="w-full flex-1">

                <MapaEntrega
                  latitudeCliente={-25.9650}
                  longitudeCliente={32.5850}
                />

              </div>

              {/* O CATÁLOGO */}
              <div className="shrink-0 w-full sm:max-w-[280px]">
                <Catalogo
                  obterQuantidade={obterQuantidade}
                  incrementarProduto={incrementarProduto}
                  decrementarProduto={decrementarProduto}
                  medidorSelecionado={medidorSelecionado}
                  setMedidorSelecionado={setMedidorSelecionado}
                />
              </div>

            </div>
          </div>

          {/* SECTOR DIREITO: CARRINHA (Props de reset vinculadas com sucesso) */}
          <div className="lg:col-span-1 h-auto lg:h-full min-h-0 w-full">
            <Carrinho
              itens={itensCarrinho}
              medidorSelecionado={medidorSelecionado}
              aoLimparCarrinho={aoLimparCarrinho}
              aoResetarCatalogo={aoResetarCatalogo}
            />
          </div>

        </div>
      </div>
    </AuthProvider>
  )
}
