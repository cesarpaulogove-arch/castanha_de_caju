'use client'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip
} from 'react-leaflet'

import L from 'leaflet'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

import type { Entregador } from '../data/entregadores'

interface Estafeta extends Entregador {
  velocidade: number
  ultimaAtualizacao: string
}

interface ComponenteMapaProps {
  estafetas: Estafeta[]
}

// Corrige os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

// Ícone dos entregadores
const iconeEstafeta = new L.Icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})


// Centraliza o mapa nos entregadores ativos
function AtualizadorCamera({
  estafetas
}: {
  estafetas: Estafeta[]
}) {
  const map = useMap()

  const jaCentralizou = useRef(false)

  useEffect(() => {

    if (jaCentralizou.current) {
      return
    }

    const ativos = estafetas.filter(
      (estafeta) => estafeta.online
    )

    if (ativos.length === 0) {
      return
    }

    const bounds = L.latLngBounds(
      ativos.map((estafeta) => [
        estafeta.latitude,
        estafeta.longitude
      ])
    )

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 14,
      animate: true
    })

    jaCentralizou.current = true

  }, [map, estafetas])

  return null
}


// MAPA
export default function ComponenteMapa({
  estafetas
}: ComponenteMapaProps) {

  const centroInicial: [number, number] = [
    -25.9653,
    32.5892
  ]

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-white/10">

      <MapContainer
        center={centroInicial}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >

        <TileLayer
          attribution="© OpenStreetMap © CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {estafetas
          .filter((estafeta) => estafeta.online)
          .map((estafeta) => (

            <Marker
              key={estafeta.id}
              position={[
                estafeta.latitude,
                estafeta.longitude
              ]}
              icon={iconeEstafeta}
            >

              <Tooltip
                permanent
                direction="top"
                offset={[0, -28]}
              >
                📍 {estafeta.nome}
              </Tooltip>

              <Popup>

                <strong>
                  {estafeta.nome}
                </strong>

                <br />

                🚴 {estafeta.velocidade} km/h

                <br />

                🕐 {estafeta.ultimaAtualizacao}

              </Popup>

            </Marker>

          ))}

        <AtualizadorCamera
          estafetas={estafetas}
        />

      </MapContainer>

    </div>
  )
}