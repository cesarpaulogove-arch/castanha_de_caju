
import Link from 'next/link'
import {
  Users,
  ArrowUpRight,
} from 'lucide-react'

import { prisma } from '@/lib/prisma'

export default async function ModuloClientes() {
  const total = await prisma.usuario.count({
    where: {
      perfil: 'CLIENTE',
    },
  })

  return (
    <Link
      href="/gestao/clientes"
      className="group rounded-3xl border border-[#e7d5b8] bg-white p-6 shadow-[0_10px_35px_rgba(92,64,32,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(92,64,32,0.12)]"
    >
      <div className="flex items-start justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
          <Users
            size={25}
            className="text-[#166534]"
          />
        </div>

        <ArrowUpRight
          size={21}
          className="text-[#a58b6d] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#166534]"
        />

      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#382515]">
        Clientes
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#806b55]">
        Consultar e gerir clientes da plataforma.
      </p>

      <div className="mt-5 border-t border-[#f0e5d5] pt-4">
        <p className="text-2xl font-extrabold text-[#166534]">
          {total}
        </p>

        <p className="text-xs font-semibold text-[#a58b6d]">
          clientes cadastrados
        </p>
      </div>

    </Link>
  )
}

