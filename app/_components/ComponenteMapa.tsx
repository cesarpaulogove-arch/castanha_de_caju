
'use client'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet'

import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'

import type { Entregador } from '../data/entregadores'

/* =========================================================
   TIPO
========================================================= */

interface ComponenteMapaProps {
  estafetas: Entregador[]
  latitudeCliente?: number
  longitudeCliente?: number
}

/* =========================================================
   ÍCONE DO ENTREGADOR
========================================================= */

const iconeEstafeta = L.divIcon({
  className: 'icone-estafeta',

  html: `
    <div style="
      position: relative;
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">

      <div style="
        position: absolute;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: rgba(22,163,74,0.20);
        animation: pulsoEstafeta 2s infinite;
      "></div>

      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #16a34a;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        z-index: 2;
      ">
        🛵
      </div>

    </div>
  `,

  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -23],
})

/* =========================================================
   ESTILOS
========================================================= */

const estilosMapa = `
  @keyframes pulsoEstafeta {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }

    50% {
      transform: scale(1.25);
      opacity: 0.25;
    }

    100% {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }

  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 2px 8px rgba(0,0,0,.20) !important;
  }

  .leaflet-control-zoom a {
    color: #374151 !important;
    background: white !important;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 12px;
  }

  .leaflet-popup-content {
    margin: 12px;
  }

  .icone-estafeta {
    background: transparent !important;
    border: none !important;
  }
`

/* =========================================================
   CENTRALIZAÇÃO INICIAL
========================================================= */

function AtualizadorCamera({
  latitudeCliente,
  longitudeCliente,
}: {
  latitudeCliente?: number
  longitudeCliente?: number
}) {
  const map = useMap()

  const jaCentralizou = useRef(false)

  useEffect(() => {
    if (jaCentralizou.current) {
      return
    }

    const latitude =
      latitudeCliente ?? -25.9653

    const longitude =
      longitudeCliente ?? 32.5892

    map.setView(
      [latitude, longitude],
      13,
      {
        animate: true,
      },
    )

    jaCentralizou.current = true
  }, [
    map,
    latitudeCliente,
    longitudeCliente,
  ])

  return null
}

/* =========================================================
   CENTRALIZAR CLIENTE
========================================================= */

function CentralizarCliente({
  latitude,
  longitude,
}: {
  latitude?: number
  longitude?: number
}) {
  const map = useMap()

  useEffect(() => {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return
    }

    map.flyTo(
      [
        latitude as number,
        longitude as number,
      ],
      15,
      {
        animate: true,
        duration: 1,
      },
    )
  }, [
    map,
    latitude,
    longitude,
  ])

  return null
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export default function ComponenteMapa({
  estafetas,
  latitudeCliente,
  longitudeCliente,
}: ComponenteMapaProps) {


const estafetasComLocalizacao = estafetas.filter(
  (estafeta) =>
    estafeta.online === true &&
    typeof estafeta.latitude === 'number' &&
    Number.isFinite(estafeta.latitude) &&
    typeof estafeta.longitude === 'number' &&
    Number.isFinite(estafeta.longitude)
)

  const centroInicial: [
    number,
    number
  ] = [
    latitudeCliente ?? -25.9653,
    longitudeCliente ?? 32.5892,
  ]

  const [
    entregadorSelecionado,
    setEntregadorSelecionado,
  ] = useState(0)

  const entregadorAtual =
    estafetas.length > 0
      ? estafetas[
          Math.min(
            entregadorSelecionado,
            estafetas.length - 1,
          )
        ]
      : null

  function anterior() {
    if (estafetas.length <= 1) {
      return
    }

    setEntregadorSelecionado(
      (valor) =>
        valor === 0
          ? estafetas.length - 1
          : valor - 1,
    )
  }

  function seguinte() {
    if (estafetas.length <= 1) {
      return
    }

    setEntregadorSelecionado(
      (valor) =>
        valor ===
        estafetas.length - 1
          ? 0
          : valor + 1,
    )
  }

  function selecionarEntregador(
    index: number,
  ) {
    setEntregadorSelecionado(index)
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

      <style>
        {estilosMapa}
      </style>

      <div className="relative w-full">

        <MapContainer
          center={centroInicial}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={true}
          dragging={true}
          doubleClickZoom={true}
          touchZoom={true}
          className="h-[200px] w-full sm:h-[240px]"
          style={{
            width: '100%',
            height: '240px',
          }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />

          <AtualizadorCamera
            latitudeCliente={
              latitudeCliente
            }
            longitudeCliente={
              longitudeCliente
            }
          />

          <CentralizarCliente
            latitude={latitudeCliente}
            longitude={longitudeCliente}
          />

          {/* =================================================
              MARCADOR DO CLIENTE
          ================================================= */}

          {Number.isFinite(
            latitudeCliente,
          ) &&
            Number.isFinite(
              longitudeCliente,
            ) && (
              <Marker
                position={[
                  latitudeCliente as number,
                  longitudeCliente as number,
                ]}
              >
                <Tooltip>
                  Localização do cliente
                </Tooltip>

                <Popup>
                  <strong>
                    📍 Localização do cliente
                  </strong>
                </Popup>
              </Marker>
            )}

          {/* =================================================
              ENTREGADORES
          ================================================= */}

          {estafetas.map(
            (
              estafeta,
              index,
            ) => {
              const selecionado =
                index ===
                entregadorSelecionado

              return (
             <Marker
                    key={estafeta.id}
                    position={[
                      estafeta.latitude,
                      estafeta.longitude
                    ]}
                    icon={iconeEstafeta}
                    zIndexOffset={
                      selecionado
                        ? 1000
                        : 0
                    }
                  >

                  <Tooltip
                    permanent
                    direction="top"
                    offset={[
                      0,
                      -25,
                    ]}
                    opacity={0.95}
                  >
                    <strong>
                      {
                        estafeta.nome
                      }
                    </strong>
                  </Tooltip>

                  <Popup>

                    <div
                      style={{
                        minWidth:
                          '180px',
                      }}
                    >

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '15px',
                          marginBottom:
                            '8px',
                        }}
                      >
                        🛵{' '}
                        {
                          estafeta.nome
                        }
                      </div>

                      <div>
                        🟢 Entregador activo
                      </div>

                      {estafeta.telefone && (
                        <div
                          style={{
                            marginTop:
                              '4px',
                          }}
                        >
                          📞{' '}
                          {
                            estafeta.telefone
                          }
                        </div>
                      )}

                    </div>

                  </Popup>

                </Marker>
              )
            },
          )}

        </MapContainer>

        {estafetas.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">

            <div className="flex items-center gap-2 text-xs text-gray-700">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="font-medium">
                Entregadores disponíveis
              </span>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          LISTA DE ENTREGADORES
      ===================================================== */}

      {estafetas.length > 0 && (
        <div className="w-full border-t border-gray-200 bg-white p-3">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-xs font-bold text-gray-800">
                Entregadores disponíveis
              </span>

            </div>

            <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
              {estafetas.length}{' '}
              disponíveis
            </span>

          </div>

          <div className="flex items-center gap-2">

            {/* ANTERIOR */}

            <button
              type="button"
              onClick={anterior}
              disabled={
                estafetas.length <= 1
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-800 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Entregador anterior"
            >
              ‹
            </button>

            {/* ENTREGADORES */}

            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">

  {/* =================================================
    ENTREGADORES
================================================= */}

{estafetasComLocalizacao.map((estafeta, index) => {
  const selecionado = index === entregadorSelecionado

  return (
    <Marker
      key={estafeta.id}
      position={[
        estafeta.latitude!,
        estafeta.longitude!
      ]}
      icon={iconeEstafeta}
      zIndexOffset={selecionado ? 1000 : 0}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -25]}
        opacity={0.95}
      >
        <strong>{estafeta.nome}</strong>
      </Tooltip>

      <Popup>
        <div style={{ minWidth: '180px' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '15px',
              marginBottom: '8px',
            }}
          >
            🛵 {estafeta.nome}
          </div>

          <div>🟢 Entregador activo</div>

          {estafeta.telefone && (
            <div style={{ marginTop: '4px' }}>
              📞 {estafeta.telefone}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
})}

            </div>

            {/* SEGUINTE */}

            <button
              type="button"
              onClick={seguinte}
              disabled={
                estafetas.length <= 1
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-800 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Próximo entregador"
            >
              ›
            </button>

          </div>

          {entregadorAtual && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px]">

              <span className="font-semibold text-gray-700">
                A acompanhar:
              </span>

              <span className="font-bold text-green-600">
                {
                  entregadorAtual.nome
                }
              </span>

            </div>
          )}

        </div>
      )}

    </div>
  )
}
