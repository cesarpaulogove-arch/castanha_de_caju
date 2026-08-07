export interface Entregador {
  id: number
  nome: string
  foto: string
  latitude: number
  longitude: number
  online: boolean
}

export const ENTREGADORES: Entregador[] = [
  {
    id: 1,
    nome: 'ANA PAULO',
    foto: '/ana.png',
    latitude: -25.9653,
    longitude: 32.5892,
    online: true
  },
  {
    id: 2,
    nome: 'JULIA CUMBI',
    foto: '/julia.png',
    latitude: -25.9611,
    longitude: 32.4612,
    online: true
  },
  {
    id: 3,
    nome: 'CESAR GOVE',
    foto: '/cesar.png',
    latitude: -25.9124,
    longitude: 32.5784,
    online: true
  },
  {
    id: 4,
    nome: 'LIGIA DA JULIA',
    foto: '/ligia.png',
    latitude: -25.9580,
    longitude: 32.4820,
    online: true
  }
]