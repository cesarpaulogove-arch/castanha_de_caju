
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import type { Entregador } from '../data/entregadores'

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
  className?: string
  latitudeCliente?: number
  longitudeCliente?: number
}

// Validar os dados recebidos da API
function temLocalizacaoValida(
  valor: unknown,
): valor is Entregador {
  if (
    typeof valor !== 'object' ||
    valor === null
  ) {
    return false
  }

  const estafeta = valor as Record<string, unknown>

  return (
    typeof estafeta.id === 'number' &&
    typeof estafeta.nome === 'string' &&
    estafeta.online === true &&
    typeof estafeta.latitude === 'number' &&
    Number.isFinite(estafeta.latitude) &&
    estafeta.latitude >= -90 &&
    estafeta.latitude <= 90 &&
    typeof estafeta.longitude === 'number' &&
    Number.isFinite(estafeta.longitude) &&
    estafeta.longitude >= -180 &&
    estafeta.longitude <= 180
  )
}

export default function MapaEntrega({
  className = '',
  latitudeCliente,
  longitudeCliente,
}: MapaEntregaProps) {
  const [entregadores, setEntregadores] = useState<Entregador[]>([])

  const [carregando, setCarregando] = useState(true)

  const [erro, setErro] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function carregarEntregadores() {
      try {
        setErro('')

        const resposta = await fetch(
          '/api/entregadores',
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          },
        )

        if (!resposta.ok) {
          throw new Error(
            'Não foi possível carregar os entregadores.',
          )
        }

        const dados: unknown = await resposta.json()

        if (!Array.isArray(dados)) {
          throw new Error(
            'A resposta da API não tem o formato esperado.',
          )
        }

        // Apenas entregadores com GPS válido
        const validos = dados.filter(
          temLocalizacaoValida,
        )

        setEntregadores(validos)
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'Erro ao carregar entregadores:',
          error,
        )

        setErro(
          'Erro ao carregar os entregadores.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    carregarEntregadores()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <section
      className={`w-full space-y-3 ${className}`}
    >
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <ComponenteMapaReal
          estafetas={entregadores}
          latitudeCliente={latitudeCliente}
          longitudeCliente={longitudeCliente}
        />
      </div>

      {carregando && (
        <p className="text-center text-sm text-gray-500">
          A carregar entregadores...
        </p>
      )}

      {!carregando && erro && (
        <p className="text-center text-sm text-red-600">
          {erro}
        </p>
      )}

      {!carregando &&
        !erro &&
        entregadores.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            Não existem entregadores online com localização GPS válida.
          </p>
        )}
    </section>
  )
}
