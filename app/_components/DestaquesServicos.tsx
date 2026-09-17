'use client'

import {
  BriefcaseBusiness,
} from 'lucide-react'

interface DestaqueServico {
  id: number
  titulo: string
  imagem: string
  entidade: string
  confirmado: boolean
  destaque: boolean
}

const DESTAQUES: DestaqueServico[] = [
  {
    id: 1,
    titulo: 'Desenvolvimento de Software',
    imagem: '/servico-software.jpg',
    entidade: '3HC Soluções Inteligentes',
    confirmado: true,
    destaque: true,
  },
  {
    id: 2,
    titulo: 'Inteligência Artificial',
    imagem: '/servico-ia.jpg',
    entidade: '3HC Soluções Inteligentes',
    confirmado: true,
    destaque: true,
  },
  {
    id: 3,
    titulo: 'Automação Empresarial',
    imagem: '/servico-automacao.jpg',
    entidade: '3HC Soluções Inteligentes',
    confirmado: true,
    destaque: true,
  },
  {
    id: 4,
    titulo: 'Projeto do Cliente',
    imagem: '/cliente-projeto.jpg',
    entidade: 'Serviço do cliente',
    confirmado: true,
    destaque: true,
  },
  {
    id: 5,
    titulo: 'Produto do Cliente',
    imagem: '/cliente-produto.jpg',
    entidade: 'Serviço do cliente',
    confirmado: true,
    destaque: true,
  },
  {
    id: 6,
    titulo: 'Serviço Especializado',
    imagem: '/cliente-servico.jpg',
    entidade: 'Serviço do cliente',
    confirmado: true,
    destaque: true,
  },
]

export default function DestaquesServicos() {
  const destaquesFiltrados = DESTAQUES.filter(
    (servico) =>
      servico.confirmado &&
      servico.destaque
  )

  return (
    <section className="mt-4 w-full space-y-3">
      {/* Cabeçalho */}
      <div className="ml-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#166534] text-white">
          <BriefcaseBusiness size={16} />
        </div>

        <h2 className="text-lg font-bold text-[#422006]">
          Destaques
        </h2>
      </div>

      {/* Cards horizontais */}
      {destaquesFiltrados.length > 0 ? (
        <div
          className="
            flex w-full gap-3
            overflow-x-auto
            px-1 py-1
            scroll-smooth
            snap-x snap-mandatory
            cursor-grab
            active:cursor-grabbing
            select-none
            touch-pan-x
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {destaquesFiltrados.map((servico) => (
            <article
              key={servico.id}
              className="
                group relative aspect-[2/1]
                w-[165px] min-w-[165px]
                snap-start overflow-hidden
                rounded-lg bg-[#422006]
                shadow-sm transition
                hover:shadow-md
                sm:w-[200px] sm:min-w-[200px]
              "
            >
              {/* Imagem */}
              <img
                src={servico.imagem}
                alt={servico.titulo}
                draggable={false}
                className="
                  absolute inset-0 h-full w-full
                  object-cover
                  transition duration-300
                  group-hover:scale-105
                "
              />

              {/* Gradiente */}
              <div className="
                absolute inset-0
                bg-gradient-to-t
                from-black/85
                via-black/20
                to-transparent
              " />

              {/* Texto */}
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <p className="
                  truncate
                  text-[10px]
                  font-semibold
                  text-green-300
                ">
                  {servico.entidade}
                </p>

                <h3 className="
                  mt-0.5
                  line-clamp-2
                  text-xs
                  font-bold
                  leading-tight
                  text-white
                ">
                  {servico.titulo}
                </h3>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="
          rounded-xl
          border border-dashed
          border-[#e7d5b8]
          bg-white
          p-5
          text-center
          text-sm
          text-gray-500
        ">
          Nenhum destaque disponível.
        </div>
      )}
    </section>
  )
}