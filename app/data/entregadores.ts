export interface Entregador {
  id: number
  nome: string
  telefone?: string
  online: boolean
  latitude: number
  longitude: number
  localizacaoAtualizada?: string
}