
import Link from 'next/link'
import {
  Boxes,
  ChevronRight,
  Package,
  TrendingUp,
} from 'lucide-react'

type ModuloStocksProps = {
  produtos: number
  quantidade: number
  movimentos: number
}

function formatarNumero(valor: number) {
  return new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(valor)
}

export default function ModuloStocks({
  produtos,
  quantidade,
  movimentos,
}: ModuloStocksProps) {
  return (
    <Link
      href="/gestao/stocks"
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
            <Boxes
              size={24}
              className="text-emerald-700"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Gestão de Stock
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Controle e acompanhamento do stock
            </p>
          </div>

        </div>

        <ChevronRight
          size={20}
          className="mt-1 text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
        />
      </div>

      {/* Indicadores */}
      <div className="mt-6 grid grid-cols-3 gap-3">

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Package
              size={16}
              className="text-gray-500"
            />

            <span className="text-xs text-gray-500">
              Produtos
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {produtos}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Boxes
              size={16}
              className="text-emerald-600"
            />

            <span className="text-xs text-gray-500">
              Stock
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {formatarNumero(quantidade)}
          </p>

          <p className="text-[11px] text-gray-400">
            kg
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={16}
              className="text-blue-600"
            />

            <span className="text-xs text-gray-500">
              Movimentos
            </span>
          </div>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {movimentos}
          </p>
        </div>

      </div>

      {/* Rodapé */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

        <span className="text-sm font-medium text-emerald-700">
          Abrir gestão de stock
        </span>

        <ChevronRight
          size={17}
          className="text-emerald-600"
        />

      </div>
    </Link>
  )
}

