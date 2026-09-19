
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

interface Estafeta extends Entregador {
  velocidade?: number
  ultimaAtualizacao?: string
}

/* =========================================================
   PROPS
========================================================= */

interface ComponenteMapaProps {
  estafetas: Estafeta[]
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
  estafetas,
}: ComponenteMapaProps) {

  const map = useMap()

  const jaCentralizou = useRef(false)

  useEffect(() => {

    if (jaCentralizou.current) {
      return
    }

    const pontos: [number, number][] = []

    const entregadoresValidos = estafetas.filter(
      (estafeta) =>
        Number.isFinite(estafeta.latitude) &&
        Number.isFinite(estafeta.longitude)
    )

    entregadoresValidos.forEach(
      (estafeta) => {

        pontos.push([
          estafeta.latitude,
          estafeta.longitude,
        ])

      }
    )

    if (pontos.length === 0) {
      return
    }

    if (pontos.length === 1) {

      map.setView(
        pontos[0],
        14,
        {
          animate: true,
        }
      )

      jaCentralizou.current = true

      return
    }

    const bounds =
      L.latLngBounds(pontos)

    map.fitBounds(
      bounds,
      {
        padding: [35, 35],
        maxZoom: 15,
        animate: true,
      }
    )

    jaCentralizou.current = true

  }, [
    map,
    estafetas,
  ])

  return null
}

/* =========================================================
   CENTRALIZAR ENTREGADOR SELECIONADO
========================================================= */

function CentralizarEntregador({
  entregador,
}: {
  entregador: Estafeta | null
}) {

  const map = useMap()

  useEffect(() => {

    if (!entregador) {
      return
    }

    if (
      !Number.isFinite(
        entregador.latitude
      ) ||
      !Number.isFinite(
        entregador.longitude
      )
    ) {
      return
    }

    map.flyTo(
      [
        entregador.latitude,
        entregador.longitude,
      ],
      15,
      {
        animate: true,
        duration: 1,
      }
    )

  }, [
    map,
    entregador,
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

  /*
   * As coordenadas do cliente estão disponíveis
   * para utilização futura no mapa.
   */

  const centroInicial: [
    number,
    number
  ] = [
    latitudeCliente ?? -25.9653,
    longitudeCliente ?? 32.5892,
  ]

  const entregadoresValidos =
    estafetas.filter(
      (estafeta) =>
        Number.isFinite(
          estafeta.latitude
        ) &&
        Number.isFinite(
          estafeta.longitude
        )
    )

  const [
    entregadorSelecionado,
    setEntregadorSelecionado,
  ] = useState(0)

  const entregadorAtual =
    entregadoresValidos.length > 0
      ? entregadoresValidos[
          Math.min(
            entregadorSelecionado,
            entregadoresValidos.length - 1
          )
        ]
      : null

  function anterior() {

    if (
      entregadoresValidos.length <= 1
    ) {
      return
    }

    setEntregadorSelecionado(
      (valor) =>
        valor === 0
          ? entregadoresValidos.length - 1
          : valor - 1
    )
  }

  function seguinte() {

    if (
      entregadoresValidos.length <= 1
    ) {
      return
    }

    setEntregadorSelecionado(
      (valor) =>
        valor ===
        entregadoresValidos.length - 1
          ? 0
          : valor + 1
    )
  }

  function selecionarEntregador(
    index: number
  ) {

    setEntregadorSelecionado(
      index
    )

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
            estafetas={estafetas}
          />

          <CentralizarEntregador
            entregador={entregadorAtual}
          />

          {entregadoresValidos.map(
            (
              estafeta,
              index
            ) => {

              const selecionado =
                index ===
                entregadorSelecionado

              const activo =
                estafeta.online === true

              return (
                <Marker
                  key={estafeta.id}
                  position={[
                    estafeta.latitude,
                    estafeta.longitude,
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
                      {estafeta.nome}
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
                        {estafeta.nome}
                      </div>

                      <div>
                        {activo ? (
                          <>
                            🟢 Activo
                          </>
                        ) : (
                          <>
                            ⚪ Offline
                          </>
                        )}
                      </div>

                      <div>
                        🚴{' '}
                        {Number(
                          estafeta.velocidade ??
                            0
                        ).toFixed(1)}

                        {' km/h'}
                      </div>

                      <div>
                        🕐{' '}
                        {estafeta.ultimaAtualizacao ??
                          'Agora'}
                      </div>

                      <div
                        style={{
                          marginTop:
                            '8px',
                          color:
                            '#6b7280',
                          fontSize:
                            '11px',
                        }}
                      >

                        GPS

                        <br />

                        {estafeta.latitude.toFixed(
                          6
                        )}

                        {' , '}

                        {estafeta.longitude.toFixed(
                          6
                        )}

                      </div>

                    </div>

                  </Popup>

                </Marker>
              )
            }
          )}

        </MapContainer>

        {entregadoresValidos.length >
          0 && (
          <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">

            <div className="flex items-center gap-2 text-xs text-gray-700">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="font-medium">
                GPS em tempo real
              </span>

            </div>

          </div>
        )}

        {entregadoresValidos.length >
          0 && (
          <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">

            <div className="text-xs text-gray-500">
              Entregadores
            </div>

            <div className="text-lg font-bold text-gray-900">
              {
                entregadoresValidos.length
              }
            </div>

          </div>
        )}

      </div>

      {entregadoresValidos.length >
        0 && (
        <div className="w-full border-t border-gray-200 bg-white p-3">

          <div className="mb-2 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-xs font-bold text-gray-800">
                Entregadores activos
              </span>

            </div>

            <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
              {
                entregadoresValidos.length
              }{' '}
              disponíveis
            </span>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={anterior}
              disabled={
                entregadoresValidos.length <=
                1
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-800 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Entregador anterior"
            >
              ‹
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">

              {entregadoresValidos.map(
                (
                  estafeta,
                  index
                ) => {

                  const selecionado =
                    index ===
                    entregadorSelecionado

                  const activo =
                    estafeta.online ===
                    true

                  return (
                    <button
                      key={estafeta.id}
                      type="button"
                      onClick={() =>
                        selecionarEntregador(
                          index
                        )
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 transition-all ${
                        selecionado
                          ? 'border-green-600 bg-green-600 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >

                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-base ${
                          selecionado
                            ? 'bg-white/20'
                            : 'bg-green-100'
                        }`}
                      >
                        🛵
                      </span>

                      <span className="flex min-w-0 flex-col items-start">

                        <span className="max-w-[100px] truncate text-[10px] font-bold sm:max-w-[130px]">
                          {
                            estafeta.nome
                          }
                        </span>

                        <span
                          className={`flex items-center gap-1 text-[9px] ${
                            selecionado
                              ? 'text-white/90'
                              : activo
                                ? 'text-green-600'
                                : 'text-gray-400'
                          }`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              activo
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}
                          />

                          {activo
                            ? 'Activo'
                            : 'Offline'}

                        </span>

                      </span>

                    </button>
                  )
                }
              )}

            </div>

            <button
              type="button"
              onClick={seguinte}
              disabled={
                entregadoresValidos.length <=
                1
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

              <span className="text-gray-300">
                •
              </span>

              <span
                className={
                  estafetaEstaOnline(
                    entregadorAtual
                  )
                    ? 'font-semibold text-green-600'
                    : 'font-semibold text-gray-400'
                }
              >
                {estafetaEstaOnline(
                  entregadorAtual
                )
                  ? 'Activo'
                  : 'Offline'}
              </span>

            </div>
          )}

        </div>
      )}

    </div>
  )
}

/* =========================================================
   VERIFICAR ESTADO
========================================================= */

function estafetaEstaOnline(
  estafeta: Estafeta
) {
  return estafeta.online === true
}