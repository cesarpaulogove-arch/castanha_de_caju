
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
      position:relative;
      width:46px;
      height:46px;
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        position:absolute;
        width:46px;
        height:46px;
        border-radius:50%;
        background:rgba(22,163,74,0.20);
        animation:pulsoEstafeta 2s infinite;
      "></div>

      <div style="
        position:relative;
        width:36px;
        height:36px;
        border-radius:50%;
        background:#16a34a;
        border:3px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:19px;
        z-index:2;
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
   ÍCONE DO CLIENTE
========================================================= */

const iconeCliente = L.divIcon({
  className: 'icone-cliente',
  html: `
    <div style="
      width:38px;
      height:38px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#2563eb;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 3px 10px rgba(0,0,0,.3);
      font-size:18px;
    ">📍</div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
})

/* =========================================================
   ESTILOS
========================================================= */

const estilosMapa = `
  @keyframes pulsoEstafeta {
    0% { transform:scale(.8); opacity:.8; }
    50% { transform:scale(1.25); opacity:.25; }
    100% { transform:scale(.8); opacity:.8; }
  }

  .leaflet-control-zoom {
    border:none !important;
    box-shadow:0 2px 8px rgba(0,0,0,.20) !important;
  }

  .leaflet-control-zoom a {
    color:#374151 !important;
    background:white !important;
  }

  .leaflet-popup-content-wrapper {
    border-radius:12px;
  }

  .leaflet-popup-content {
    margin:12px;
  }

  .icone-estafeta,
  .icone-cliente {
    background:transparent !important;
    border:none !important;
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
  const inicializado = useRef(false)

  useEffect(() => {
    if (inicializado.current) return

    const latitude =
      latitudeCliente ?? -25.9653

    const longitude =
      longitudeCliente ?? 32.5892

    map.setView([latitude, longitude], 13)
    inicializado.current = true
  }, [map, latitudeCliente, longitudeCliente])

  return null
}

/* =========================================================
   CENTRALIZAR ENTREGADOR SELECCIONADO
========================================================= */

function CentralizarEntregador({
  latitude,
  longitude,
  pedido,
}: {
  latitude: number
  longitude: number
  pedido: number
}) {
  const map = useMap()

  useEffect(() => {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) return

    map.flyTo(
      [latitude, longitude],
      17,
      {
        animate: true,
        duration: 1.5,
      }
    )
  }, [map, latitude, longitude, pedido])

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

  // ==========================================
  // VALIDAR ENTREGADORES
  // ==========================================

  const estafetasComLocalizacao = estafetas.filter(
    (estafeta) => {
      if (
        estafeta.latitude === null ||
        estafeta.latitude === undefined ||
        estafeta.longitude === null ||
        estafeta.longitude === undefined
      ) return false

      const latitude = Number(estafeta.latitude)
      const longitude = Number(estafeta.longitude)

      return (
        estafeta.online === true &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180 &&
        (latitude !== 0 || longitude !== 0)
      )
    }
  )

  // ==========================================
  // ESTADOS
  // ==========================================

  const [entregadorSelecionado, setEntregadorSelecionado] =
    useState(0)

  const [pedidoCentralizacao, setPedidoCentralizacao] =
    useState(0)

  const total = estafetasComLocalizacao.length

  const indiceSelecionado =
    total > 0
      ? Math.min(entregadorSelecionado, total - 1)
      : 0

  const entregadorAtual =
    total > 0
      ? estafetasComLocalizacao[indiceSelecionado]
      : null

  const centroInicial: [number, number] = [
    latitudeCliente ?? -25.9653,
    longitudeCliente ?? 32.5892,
  ]

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================

  function anterior() {
    if (total <= 1) return

    setEntregadorSelecionado((valor) =>
      valor === 0 ? total - 1 : valor - 1
    )

    setPedidoCentralizacao((valor) => valor + 1)
  }

  function seguinte() {
    if (total <= 1) return

    setEntregadorSelecionado((valor) =>
      valor >= total - 1 ? 0 : valor + 1
    )

    setPedidoCentralizacao((valor) => valor + 1)
  }

  function selecionarEntregador(index: number) {
    setEntregadorSelecionado(index)
    setPedidoCentralizacao((valor) => valor + 1)
  }

  // ==========================================
  // INTERFACE
  // ==========================================

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

      <style>{estilosMapa}</style>

      <div className="relative w-full">

        <MapContainer
          center={centroInicial}
          zoom={13}
          scrollWheelZoom
          zoomControl
          className="h-[260px] w-full sm:h-[280px]"
          style={{
            width: '100%',
            height: '260px',
          }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />

          <AtualizadorCamera
            latitudeCliente={latitudeCliente}
            longitudeCliente={longitudeCliente}
          />

          {/* CENTRALIZAÇÃO DO ENTREGADOR */}

          {entregadorAtual && (
            <CentralizarEntregador
              latitude={Number(entregadorAtual.latitude)}
              longitude={Number(entregadorAtual.longitude)}
              pedido={pedidoCentralizacao}
            />
          )}

          {/* MARCADOR DO CLIENTE */}

          {typeof latitudeCliente === 'number' &&
            typeof longitudeCliente === 'number' &&
            Number.isFinite(latitudeCliente) &&
            Number.isFinite(longitudeCliente) && (
              <Marker
                position={[
                  latitudeCliente,
                  longitudeCliente,
                ]}
                icon={iconeCliente}
              >
                <Tooltip>Localização do cliente</Tooltip>

                <Popup>
                  <strong>📍 Localização do cliente</strong>
                </Popup>
              </Marker>
            )}

          {/* MARCADORES DOS ENTREGADORES */}

          {estafetasComLocalizacao.map((estafeta, index) => {
            const latitude = Number(estafeta.latitude)
            const longitude = Number(estafeta.longitude)

            const selecionado =
              index === indiceSelecionado

            return (
              <Marker
                key={estafeta.id}
                position={[latitude, longitude]}
                icon={iconeEstafeta}
                zIndexOffset={selecionado ? 1000 : 0}
              >
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -25]}
                >
                  <strong>{estafeta.nome}</strong>
                </Tooltip>

                <Popup>
                  <div style={{ minWidth: '180px' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '15px',
                      marginBottom: '8px',
                    }}>
                      🛵 {estafeta.nome}
                    </div>

                    <div>🟢 Entregador online</div>

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

        </MapContainer>

        {/* ESTADO DO MAPA */}

        {total > 0 && (
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

      {/* LISTA DE ENTREGADORES */}

      <div className="w-full border-t border-gray-200 bg-white p-3">

        {total > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-bold text-gray-800">
                  Entregadores disponíveis
                </span>
              </div>

              <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                {total} disponíveis
              </span>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={anterior}
                disabled={total <= 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-800 hover:bg-green-100 disabled:opacity-40"
                aria-label="Entregador anterior"
              >
                ‹
              </button>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">

                {estafetasComLocalizacao.map((estafeta, index) => {
                  const selecionado =
                    index === indiceSelecionado

                  return (
                    <button
                      key={estafeta.id}
                      type="button"
                      onClick={() => selecionarEntregador(index)}
                      className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        selecionado
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      🛵 {estafeta.nome}
                    </button>
                  )
                })}

              </div>

              <button
                type="button"
                onClick={seguinte}
                disabled={total <= 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-800 hover:bg-green-100 disabled:opacity-40"
                aria-label="Próximo entregador"
              >
                ›
              </button>

            </div>

            {entregadorAtual && (
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
                <span className="font-semibold text-gray-700">
                  Seleccionado:
                </span>

                <span className="font-bold text-green-600">
                  {entregadorAtual.nome}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="py-5 text-center">
            <div className="mb-2 text-2xl">🛵</div>

            <p className="text-sm font-semibold text-gray-700">
              Nenhum entregador disponível
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Os entregadores online com GPS válido aparecerão aqui.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
