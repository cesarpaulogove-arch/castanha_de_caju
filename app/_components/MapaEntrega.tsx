
'use client'

import dynamic from 'next/dynamic'
import {
  Navigation,
  RefreshCw,
} from 'lucide-react'

import {
  ENTREGADORES,
  type Entregador,
} from '../data/entregadores'

const ComponenteMapaReal = dynamic(
  () => import('./ComponenteMapa'),
  {
    ssr: false,

    loading: () => (
      <div className="flex min-h-[180px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
        A carregar o mapa...
      </div>
    ),
  },
)

interface MapaEntregaProps {
  estafetas?: Entregador[]
  className?: string
}

export default function MapaEntrega({
  estafetas = ENTREGADORES,
  className = '',
}: MapaEntregaProps) {

  /*
   * IMPORTANTE:
   *
   * Os entregadores são independentes do cliente.
   *
   * O cliente NÃO precisa fornecer a sua localização
   * para visualizar os entregadores.
   *
   * A posição do cliente poderá ser adicionada
   * posteriormente para cálculo de distância/rota.
   */

  const entregadoresComLocalizacao = estafetas.filter(
    (estafeta) =>
      Number.isFinite(estafeta.latitude) &&
      Number.isFinite(estafeta.longitude),
  )

  return (
    <section
      className={`w-full space-y-3 ${className}`}
    >

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Quantidade de entregadores */}
        <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
          {entregadoresComLocalizacao.length}{' '}
          {entregadoresComLocalizacao.length === 1
            ? 'entregador'
            : 'entregadores'}
        </div>

      </div>


      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

        <ComponenteMapaReal
          estafetas={estafetas}
        />

      </div>

    </section>
  )
}

