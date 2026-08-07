import { ENTREGADORES } from './entregadores'
import { calcularDistancia } from './distancia'

export function encontrarEntregadorMaisProximo(
  latitudeCliente: number,
  longitudeCliente: number
) {
  const entregadoresOnline = ENTREGADORES.filter(
    (entregador) => entregador.online
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

  for (const entregador of entregadoresOnline) {
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