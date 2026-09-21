
'use client'

import dynamic from 'next/dynamic'

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
  latitudeCliente?: number
  longitudeCliente?: number
}

export default function MapaEntrega({
  estafetas = ENTREGADORES,
  className = '',
  latitudeCliente,
  longitudeCliente,
}: MapaEntregaProps) {

  const entregadoresComLocalizacao = estafetas.filter(
    (estafeta) =>
      Number.isFinite(estafeta.latitude) &&
      Number.isFinite(estafeta.longitude),
  )

  return (
    <section
      className={`w-full space-y-3 ${className}`}
    >

      {/* CABEÇALHO */}

      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

        <ComponenteMapaReal
          estafetas={estafetas}
          latitudeCliente={latitudeCliente}
          longitudeCliente={longitudeCliente}
        />

      </div>

    </section>
  )
}