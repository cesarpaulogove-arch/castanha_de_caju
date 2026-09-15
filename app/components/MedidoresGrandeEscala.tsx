
'use client'

import type {
  MedidorGrandeVolume,
} from '../page'

import CardGrandeVolume from './CardGrandeVolume'

interface MedidoresGrandeEscalaProps {
  medidores: MedidorGrandeVolume[]
  selecionado: MedidorGrandeVolume | null
  onSelecionar: (
    medidor: MedidorGrandeVolume
  ) => void
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
        md:grid-cols-4
        lg:grid-cols-5
        xl:gap-4
      "
    >
      {medidores.slice(0, 6).map((medidor) => (
        <CardGrandeVolume
          key={medidor.id}
          medidor={medidor}
          selecionado={
            selecionado?.id === medidor.id
          }
          onSelecionar={() =>
            onSelecionar(medidor)
          }
        />
      ))}
    </div>
  )
}
