
import { calcularDistancia } from './distancia'

export interface EntregadorLocalizacao {
  id: number
  nome: string
  telefone?: string
  online: boolean
  latitude: number
  longitude: number
}

export function encontrarEntregadorMaisProximo(
  latitudeCliente: number,
  longitudeCliente: number,
  entregadores: EntregadorLocalizacao[]
) {
  if (
    !Number.isFinite(latitudeCliente) ||
    !Number.isFinite(longitudeCliente)
  ) {
    return null
  }

  const entregadoresOnline = entregadores.filter(
    (entregador) =>
      entregador.online &&
      Number.isFinite(entregador.latitude) &&
      Number.isFinite(entregador.longitude)
  )

  if (entregadoresOnline.length === 0) {
    return null
  }

  let maisProximo = entregadoresOnline[0]

  let menorDistancia = calcularDistancia(
    latitudeCliente,
    longitudeCliente,
    maisProximo.latitude,
    maisProximo.longitude
  )

  for (const entregador of entregadoresOnline.slice(1)) {
    const distancia = calcularDistancia(
      latitudeCliente,
      longitudeCliente,
      entregador.latitude,
      entregador.longitude
    )

    if (distancia < menorDistancia) {
      menorDistancia = distancia
      maisProximo = entregador
    }
  }

  return {
    entregador: maisProximo,
    distanciaKm: menorDistancia
  }
}
