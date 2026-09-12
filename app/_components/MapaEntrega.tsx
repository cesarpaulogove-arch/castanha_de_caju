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