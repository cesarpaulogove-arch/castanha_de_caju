'use client'

import CardGrandeVolume from './CardGrandeVolume'

interface MedidorGrandeVolume {
  id: string
  nome: string
  quantidade: number
  unidade: 'kg' | 'ton'
  descricao: string
  imagem: string
  preco: number
}

interface MedidoresGrandeEscalaProps {
  medidores: MedidorGrandeVolume[]
  selecionado: MedidorGrandeVolume | null
  onSelecionar: (medidor: MedidorGrandeVolume) => void
}

export default function MedidoresGrandeEscala({
  medidores,
  selecionado,
  onSelecionar,
}: MedidoresGrandeEscalaProps) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-3
        xl:gap-5
      "
    >
      {medidores.slice(0, 6).map((medidor) => (
        <CardGrandeVolume
          key={medidor.id}
          medidor={medidor}
          selecionado={selecionado?.id === medidor.id}
          onSelecionar={() => onSelecionar(medidor)}
        />
      ))}
    </div>
  )
}