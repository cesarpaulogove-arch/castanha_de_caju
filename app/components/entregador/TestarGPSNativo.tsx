
'use client'

import { useState } from 'react'
import { Geolocation } from '@capacitor/geolocation'
import { Capacitor } from '@capacitor/core'

export default function TestarGPSNativo() {
  const [resultado, setResultado] = useState('GPS ainda não testado')
  const [aCarregar, setACarregar] = useState(false)

  async function testarGPS() {
    try {
      setACarregar(true)
      setResultado('A verificar GPS nativo...')

      if (!Capacitor.isNativePlatform()) {
        setResultado('A aplicação não está a executar como app nativa.')
        return
      }

      const permissao = await Geolocation.requestPermissions()

      console.log('PERMISSÕES:', permissao)

      if (
        permissao.location !== 'granted' &&
        permissao.coarseLocation !== 'granted'
      ) {
        setResultado('Permissão GPS não concedida.')
        return
      }

      const posicao = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      })

      const dados = {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisao: posicao.coords.accuracy,
        timestamp: new Date(posicao.timestamp).toLocaleString(),
      }

      console.log('RESULTADO GPS NATIVO:', dados)

      setResultado(JSON.stringify(dados, null, 2))
    } catch (error) {
      console.error('ERRO GPS NATIVO:', error)
      setResultado(String(error))
    } finally {
      setACarregar(false)
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <h3 className="font-semibold">Diagnóstico GPS Android</h3>

      <button
        onClick={testarGPS}
        disabled={aCarregar}
        className="rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {aCarregar ? 'A testar...' : 'Testar GPS nativo'}
      </button>

      <pre className="whitespace-pre-wrap break-words text-xs">
        {resultado}
      </pre>
    </div>
  )
}
