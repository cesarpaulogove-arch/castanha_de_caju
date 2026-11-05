
'use client'

import { useEffect, useState } from 'react'

interface Props {
  online: boolean
}

export default function AtualizarLocalizacao({ online }: Props) {
  const [estado, setEstado] = useState('A aguardar...')
  const [coordenadas, setCoordenadas] = useState('')
  const [precisao, setPrecisao] = useState<number | null>(null)

  useEffect(() => {
    if (!online) {
      setEstado('GPS desactivado: entregador offline.')
      setCoordenadas('')
      setPrecisao(null)
      return
    }

    if (!navigator.geolocation) {
      setEstado('Este navegador não suporta geolocalização.')
      return
    }

    let activo = true

    setEstado('A obter localização do dispositivo...')

    const watchId = navigator.geolocation.watchPosition(
      async (posicao) => {
        if (!activo) return

        const {
          latitude,
          longitude,
          accuracy,
        } = posicao.coords

        console.log('GPS DO DISPOSITIVO:', {
          latitude,
          longitude,
          precisaoMetros: accuracy,
          timestamp: new Date(posicao.timestamp).toLocaleString(),
        })

        setCoordenadas(
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        )
        setPrecisao(accuracy)

        // Não guardar posições demasiado imprecisas.
        if (accuracy > 500) {
          setEstado(
            `GPS impreciso (${Math.round(accuracy)} m). A aguardar melhor localização.`
          )
          return
        }

        setEstado('A enviar localização para o servidor...')

        try {
          const resposta = await fetch('/api/entregadores/localizacao', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
            }),
          })

          const dados = await resposta.json()

          if (!activo) return

          if (!resposta.ok) {
            setEstado(
              dados.mensagem || 'Erro ao actualizar localização.'
            )
            return
          }

          setEstado(
            `GPS actualizado. Precisão estimada: ${Math.round(accuracy)} m.`
          )

        } catch (error) {
          console.error('Erro ao enviar GPS:', error)

          if (activo) {
            setEstado('Não foi possível enviar a localização.')
          }
        }
      },

      (erro) => {
        console.error('Erro de geolocalização:', erro)

        if (!activo) return

        if (erro.code === erro.PERMISSION_DENIED) {
          setEstado('Permissão de localização recusada.')
        } else if (erro.code === erro.POSITION_UNAVAILABLE) {
          setEstado('Localização indisponível.')
        } else {
          setEstado('Tempo esgotado ao obter localização.')
        }
      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000,
      }
    )

    return () => {
      activo = false
      navigator.geolocation.clearWatch(watchId)
    }
  }, [online])

  return (
    <div className="mt-2 space-y-1 text-xs">
      <p className={online ? 'text-green-700' : 'text-gray-500'}>
        {estado}
      </p>

      {coordenadas && (
        <p className="text-gray-600">
          Coordenadas: {coordenadas}
        </p>
      )}

      {precisao !== null && (
        <p className="text-gray-500">
          Precisão estimada: {Math.round(precisao)} metros
        </p>
      )}
    </div>
  )
}
