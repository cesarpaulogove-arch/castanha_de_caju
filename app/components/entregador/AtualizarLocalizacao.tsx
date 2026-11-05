
'use client'

import { useEffect, useState } from 'react'

interface Props {
  online: boolean
}

export default function AtualizarLocalizacao({ online }: Props) {
  const [estado, setEstado] = useState('')

  useEffect(() => {
    if (!online) {
      setEstado('GPS desactivado: entregador offline.')
      return
    }

    if (!navigator.geolocation) {
      setEstado('Este navegador não suporta geolocalização.')
      return
    }

    setEstado('A solicitar acesso ao GPS...')

    const watchId = navigator.geolocation.watchPosition(
      async (posicao) => {
        const {
            latitude,
            longitude,
            accuracy,
            } = posicao.coords

            console.log('LOCALIZAÇÃO DO DISPOSITIVO:', {
            latitude,
            longitude,
            precisaoMetros: accuracy,
            timestamp: new Date(posicao.timestamp).toLocaleString(),
            })

        try {
          const resposta = await fetch(
            '/api/entregadores/localizacao',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                latitude,
                longitude,
              }),
            },
          )

          const dados = await resposta.json()

          if (!resposta.ok) {
            setEstado(
              dados.mensagem || 'Erro ao actualizar localização.',
            )
            return
          }

          setEstado('GPS activo. Localização actualizada.')
        } catch (error) {
          console.error('Erro ao enviar GPS:', error)
          setEstado('Não foi possível enviar a localização.')
        }
      },
      (erro) => {
        console.error('Erro de geolocalização:', erro)

        if (erro.code === erro.PERMISSION_DENIED) {
          setEstado('Permissão de localização recusada no navegador.')
        } else if (erro.code === erro.POSITION_UNAVAILABLE) {
          setEstado('Localização GPS indisponível.')
        } else {
          setEstado('Tempo esgotado ao obter localização.')
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [online])

  return (
    <p
      className={`mt-2 text-xs ${
        online ? 'text-green-700' : 'text-gray-500'
      }`}
    >
      {estado}
    </p>
  )
}
