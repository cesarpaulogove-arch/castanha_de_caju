'use client'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
  Circle,
  Polyline
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
  popupAnchor: [0, -23]
})


/* =========================================================
   ÍCONE DO CLIENTE
========================================================= */

const iconeCliente = L.divIcon({
  className: 'icone-cliente',

  html: `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50% 50% 50% 0;
      background: #2563eb;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    ">

      <div style="
        transform: rotate(45deg);
        font-size: 18px;
      ">
        📍
      </div>

    </div>
  `,

  iconSize: [40, 40],
  iconAnchor: [20, 35],
  popupAnchor: [0, -35]
})


/* =========================================================
   ANIMAÇÃO DO MARCADOR
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
`


/* =========================================================
   CENTRALIZAÇÃO AUTOMÁTICA
========================================================= */

function AtualizadorCamera({
  estafetas,
  latitudeCliente,
  longitudeCliente
}: ComponenteMapaProps) {

  const map = useMap()

  const jaCentralizou = useRef(false)

  useEffect(() => {

    if (jaCentralizou.current) {
      return
    }

    const pontos: [number, number][] = []

    /*
     * CLIENTE
     */

    if (
      typeof latitudeCliente === 'number' &&
      typeof longitudeCliente === 'number'
    ) {

      pontos.push([
        latitudeCliente,
        longitudeCliente
      ])

    }

    /*
     * ENTREGADORES ATIVOS
     */

    const ativos = estafetas.filter(
      (estafeta) =>
        estafeta.online &&
        Number.isFinite(estafeta.latitude) &&
        Number.isFinite(estafeta.longitude)
    )

    ativos.forEach((estafeta) => {

      pontos.push([
        estafeta.latitude,
        estafeta.longitude
      ])

    })

    /*
     * NÃO HÁ PONTOS
     */

    if (pontos.length === 0) {
      return
    }

    /*
     * APENAS UM PONTO
     */

    if (pontos.length === 1) {

      map.setView(
        pontos[0],
        14,
        {
          animate: true
        }
      )

      jaCentralizou.current = true

      return
    }

    /*
     * VÁRIOS PONTOS
     */

    const bounds = L.latLngBounds(pontos)

    map.fitBounds(
      bounds,
      {
        padding: [70, 70],
        maxZoom: 15,
        animate: true
      }
    )

    jaCentralizou.current = true

  }, [
    map,
    estafetas,
    latitudeCliente,
    longitudeCliente
  ])

  return null
}


/* =========================================================
   MAPA
========================================================= */

export default function ComponenteMapa({
  estafetas,
  latitudeCliente,
  longitudeCliente
}: ComponenteMapaProps) {

  /*
   * Centro inicial:
   * Maputo
   */

  const centroInicial: [number, number] = [
    -25.9653,
    32.5892
  ]


  /*
   * ENTREGADORES ONLINE COM GPS VÁLIDO
   */

  const ativos = estafetas.filter(
    (estafeta) =>
      estafeta.online &&
      Number.isFinite(estafeta.latitude) &&
      Number.isFinite(estafeta.longitude)
  )


  /*
   * ENTREGADOR MAIS PRÓXIMO
   *
   * Por enquanto usamos o primeiro ativo.
   * A função de distância pode ser ligada
   * depois ao teu encontrarEntregadorMaisProximo.
   */

  const entregadorPrincipal =
    ativos.length > 0
      ? ativos[0]
      : null


  return (

    <div
      className="
        relative
        w-full
        h-full
        min-h-[400px]
        rounded-xl
        overflow-hidden
        border
        border-gray-200
        bg-gray-100
      "
    >

      {/* ESTILOS */}

      <style>
        {estilosMapa}
      </style>


      {/* ===================================================
          MAPA REAL
      =================================================== */}

      <MapContainer

        center={centroInicial}

        zoom={13}

        scrollWheelZoom={true}

        zoomControl={true}

        dragging={true}

        doubleClickZoom={true}

        touchZoom={true}

        className="
          w-full
          h-full
          z-0
        "

      >

        {/* =================================================
            OPENSTREETMAP
        ================================================= */}

        <TileLayer

          url="
            https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          "

          attribution="
            &copy; OpenStreetMap contributors
          "

          maxZoom={19}

        />


        {/* =================================================
            CENTRALIZAÇÃO
        ================================================= */}

        <AtualizadorCamera

          estafetas={estafetas}

          latitudeCliente={latitudeCliente}

          longitudeCliente={longitudeCliente}

        />


        {/* =================================================
            CLIENTE
        ================================================= */}

        {typeof latitudeCliente === 'number' &&
          typeof longitudeCliente === 'number' &&
          Number.isFinite(latitudeCliente) &&
          Number.isFinite(longitudeCliente) && (

          <>

            <Marker

              position={[
                latitudeCliente,
                longitudeCliente
              ]}

              icon={iconeCliente}

            >

              <Tooltip
                direction="top"
                offset={[0, -25]}
              >

                Local de entrega

              </Tooltip>


              <Popup>

                <div className="text-sm">

                  <strong>
                    Local de entrega
                  </strong>

                  <div className="mt-1 text-gray-500">

                    GPS:
                    <br />

                    {latitudeCliente.toFixed(6)}
                    {' , '}
                    {longitudeCliente.toFixed(6)}

                  </div>

                </div>

              </Popup>

            </Marker>


            {/* ÁREA DE LOCALIZAÇÃO */}

            <Circle

              center={[
                latitudeCliente,
                longitudeCliente
              ]}

              radius={70}

              pathOptions={{
                color: '#2563eb',
                fillColor: '#2563eb',
                fillOpacity: 0.08,
                weight: 1
              }}

            />

          </>

        )}


        {/* =================================================
            ENTREGADORES
        ================================================= */}

        {ativos.map((estafeta) => (

          <Marker

            key={estafeta.id}

            position={[
              estafeta.latitude,
              estafeta.longitude
            ]}

            icon={iconeEstafeta}

          >

            {/* NOME */}

            <Tooltip

              permanent

              direction="top"

              offset={[0, -25]}

              opacity={0.95}

            >

              <strong>
                {estafeta.nome}
              </strong>

            </Tooltip>


            {/* INFORMAÇÃO */}

            <Popup>

              <div
                style={{
                  minWidth: '180px'
                }}
              >

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '15px',
                    marginBottom: '8px'
                  }}
                >

                  🛵 {estafeta.nome}

                </div>


                <div>

                  🟢{' '}

                  {estafeta.online
                    ? 'Online'
                    : 'Offline'
                  }

                </div>


                <div>

                  🚴{' '}

                  {Number(
                    estafeta.velocidade ?? 0
                  ).toFixed(1)}

                  {' km/h'}

                </div>


                <div>

                  🕐{' '}

                  {estafeta.ultimaAtualizacao}

                </div>


                <div
                  style={{
                    marginTop: '8px',
                    color: '#6b7280',
                    fontSize: '11px'
                  }}
                >

                  GPS

                  <br />

                  {estafeta.latitude.toFixed(6)}
                  {' , '}
                  {estafeta.longitude.toFixed(6)}

                </div>

              </div>

            </Popup>

          </Marker>

        ))}


        {/* =================================================
            LINHA ENTREGADOR → CLIENTE
        ================================================= */}

        {entregadorPrincipal &&

          typeof latitudeCliente === 'number' &&
          typeof longitudeCliente === 'number' && (

          <Polyline

            positions={[

              [
                entregadorPrincipal.latitude,
                entregadorPrincipal.longitude
              ],

              [
                latitudeCliente,
                longitudeCliente
              ]

            ]}

            pathOptions={{
              color: '#2563eb',
              weight: 4,
              opacity: 0.65,
              dashArray: '8 10'
            }}

          />

        )}

      </MapContainer>


      {/* ===================================================
          STATUS GPS
      =================================================== */}

      <div
        className="
          absolute
          top-3
          left-3
          z-[1000]
          bg-white
          rounded-xl
          shadow-lg
          border
          border-gray-200
          px-3
          py-2
        "
      >

        <div className="
          flex
          items-center
          gap-2
          text-xs
          text-gray-700
        ">

          <span
            className="
              w-2.5
              h-2.5
              rounded-full
              bg-green-500
              animate-pulse
            "
          />

          <span className="font-medium">

            GPS em tempo real

          </span>

        </div>

      </div>


      {/* ===================================================
          CONTADOR
      =================================================== */}

      <div
        className="
          absolute
          top-3
          right-3
          z-[1000]
          bg-white
          rounded-xl
          shadow-lg
          border
          border-gray-200
          px-3
          py-2
        "
      >

        <div className="
          text-xs
          text-gray-500
        ">

          Entregadores ativos

        </div>

        <div className="
          text-lg
          font-bold
          text-gray-900
        ">

          {ativos.length}

        </div>

      </div>


      {/* ===================================================
          LEGENDA
      =================================================== */}

      <div
        className="
          absolute
          bottom-3
          left-3
          z-[1000]
          bg-white
          rounded-xl
          shadow-lg
          border
          border-gray-200
          px-3
          py-2
          text-xs
          text-gray-700
        "
      >

        <div className="
          flex
          items-center
          gap-3
        ">

          <span>
            🛵 Entregador
          </span>

          <span>
            📍 Cliente
          </span>

        </div>

      </div>

    </div>
  )
}