'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Navigation } from 'lucide-react'

import {
  ENTREGADORES,
  type Entregador
} from '../data/entregadores'

import { encontrarEntregadorMaisProximo } from '../data/encontrarEntregador'

interface Estafeta extends Entregador {
  velocidade: number
  ultimaAtualizacao: string
}

interface MapaEntregaProps {
  latitudeCliente: number
  longitudeCliente: number
}

const ComponenteMapaReal = dynamic(
  () => import('./ComponenteMapa'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-400">
        A carregar mapa...
      </div>
    )
  }
)

export default function MapaEntrega({
  latitudeCliente,
  longitudeCliente
}: MapaEntregaProps) {

  const [estafetas, setEstafetas] = useState<Estafeta[]>(
    ENTREGADORES.map((entregador) => ({
      ...entregador,
      velocidade: 0,
      ultimaAtualizacao: new Date().toLocaleTimeString()
    }))
  )

  /*
   * ENCONTRAR O ENTREGADOR MAIS PRÓXIMO DO CLIENTE
   */
  const resultado = encontrarEntregadorMaisProximo(
    latitudeCliente,
    longitudeCliente
  )

  console.log('CLIENTE:', latitudeCliente, longitudeCliente)
  console.log('RESULTADO:', resultado)
  console.log('DISTÂNCIA:', resultado?.distanciaKm)

  useEffect(() => {

    const escutarEventoTempoReal = (
      dadosAtualizados: Partial<Estafeta> & { id: number }
    ) => {

      setEstafetas((listaAtual) =>
        listaAtual.map((estafeta) =>
          estafeta.id === dadosAtualizados.id
            ? {
              ...estafeta,
              ...dadosAtualizados,
              ultimaAtualizacao:
                new Date().toLocaleTimeString()
            }
            : estafeta
        )
      )
    }

    /*
     * FUTURO SOCKET:
     *
     * socket.on(
     *   'entregador:localizacao',
     *   escutarEventoTempoReal
     * )
     */

    return () => {

      /*
       * FUTURO SOCKET:
       *
       * socket.off(
       *   'entregador:localizacao',
       *   escutarEventoTempoReal
       * )
       */

    }

  }, [])

  return (
    <div>

      {/* CABEÇALHO */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Navigation className="w-5 h-5 text-green-400" />

          <div>

            <h2 className="text-white font-bold">
             HUB SUL: CIDADE DE MAPUTO E MATOLA
            </h2>

          </div>

        </div>

        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
          {estafetas.filter((e) => e.online).length} Ativos
        </div>

      </div>


      {/* ENTREGADOR MAIS PRÓXIMO */}

      {resultado && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">

          <p className="text-xs text-gray-400">
            Entregador mais próximo
          </p>

          <p className="text-white font-bold">
            {resultado.entregador.nome}
          </p>

          <p className="text-green-400 text-sm">
            {resultado.distanciaKm.toFixed(2)} km de distância
          </p>

        </div>
      )}


      {/* MAPA */}

     <div
  className="
    relative
    w-full
    h-[180px]
    sm:h-[300px]
    md:h-[380px]
    rounded-xl
    overflow-hidden
    border border-white/10
  "
>

        <ComponenteMapaReal
          estafetas={estafetas}
        />

      </div>

    </div>
  )
}