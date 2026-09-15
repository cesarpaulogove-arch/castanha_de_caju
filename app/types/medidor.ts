export interface MedidorGrandeVolume {
  id: string
  nome: string
  quantidade: number
  unidade: 'kg' | 'ton'
  descricao: string
  imagem: string
  preco: number
}