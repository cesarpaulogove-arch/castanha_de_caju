
'use client'

import {
  Briefcase,
  MapPin,
  Mail,
  Cpu,
  Target,
  Eye,
  ShieldCheck,
} from 'lucide-react'

import Image from 'next/image'

// Estrutura da equipa de trabalho
const RESPONSAVEIS = [
  {
    id: 1,
    nome: 'ANA PAULO GOVE',
    cargo: 'Nuts Lead',
    responsabilidade: 'Inspeção e testes de qualidade',
    tamanhoClass: 'w-20 h-20 md:w-24 md:h-24',
    imagem: '/ana.png',
  },
  {
    id: 2,
    nome: 'JULIA F. CUMBI',
    cargo: 'Dir. Operações',
    responsabilidade: 'Gestão de processamento',
    tamanhoClass: 'w-20 h-20 md:w-26 md:h-26',
    imagem: '/julia.png',
  },
  {
    id: 3,
    nome: 'CESAR PAULO GOVE',
    cargo: 'Administrador',
    responsabilidade: 'Estratégia e Inovação Sul',
    tamanhoClass:
      'w-28 h-28 md:w-36 md:h-36 border-2 border-amber-500 scale-110',
    imagem: '/cesar.png',
  },
  {
    id: 4,
    nome: 'LIGIA DA JULIA',
    cargo: 'Aplicações e Soluções',
    responsabilidade: 'Desenvolvimento de sistemas',
    tamanhoClass: 'w-20 h-20 md:w-26 md:h-26',
    imagem: '/ligia.png',
  },
  {
    id: 5,
    nome: 'HELDER MATSINHE',
    cargo: 'Parceiro Estratégico',
    responsabilidade: 'Desenvolvimento de circuitos',
    tamanhoClass: 'w-20 h-20 md:w-24 md:h-24',
    imagem: '/helder.png',
  },
]

export default function PerfilEmpresa() {
  return (
    <main className="min-h-screen w-full bg-[#fff8e8] px-4 py-6 font-sans text-[#382515] md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">

        {/* Cabeçalho da página */}
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#166534] shadow-md">
            <Briefcase
              size={28}
              className="text-white"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Perfil Empresarial
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#806b55]">
            Estratégia, qualidade, sustentabilidade e inovação
            para o desenvolvimento de uma cadeia de valor
            de castanhas.
          </p>
        </header>

        {/* Cartão principal */}
        <section className="space-y-8 rounded-3xl border border-[#e7d5b8] bg-white p-5 shadow-[0_15px_45px_rgba(92,64,32,0.08)] sm:p-8">

          {/* Cabeçalho corporativo */}
          <div className="flex flex-col gap-4 border-b border-[#f0e5d5] pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
                <Briefcase size={24} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#382515]">
                  Estratégia Empresarial
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#806b55]">
                  Qualidade, Sustentabilidade e Ecossistema
                  Aninha Castanhas Diango
                </p>
              </div>
            </div>

            <span className="self-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold tracking-wide text-amber-700 sm:self-auto">
              LIGA: 864018233
            </span>
          </div>

          {/* Objetivo geral */}
          <section className="rounded-2xl border border-[#f0e5d5] bg-[#fffdf8] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target
                size={20}
                className="text-[#166534]"
              />

              <h3 className="font-extrabold text-[#382515]">
                Objetivo Geral
              </h3>
            </div>

            <p className="text-sm leading-7 text-[#806b55]">
              Desenvolver uma cadeia de valor sustentável para
              o processamento, embalagem e comercialização das
              <span className="font-bold text-[#166534]">
                {' '}Castanhas Aninha Diango
              </span>
              , promovendo produtos de elevada qualidade,
              agregando valor à produção local, gerando emprego,
              fortalecendo parcerias estratégicas e contribuindo
              para o desenvolvimento económico e social de
              Moçambique.
            </p>
          </section>

          {/* Missão e visão */}
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-[#f0e5d5] bg-[#fffdf8] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Cpu
                  size={19}
                  className="text-[#166534]"
                />

                <h3 className="font-extrabold text-[#382515]">
                  Missão
                </h3>
              </div>

              <p className="text-sm leading-7 text-[#806b55]">
                Processar, embalar e comercializar castanhas
                de alta qualidade, garantindo segurança
                alimentar, inovação, sustentabilidade e
                excelência no atendimento, valorizando os
                produtores locais e oferecendo produtos que
                satisfaçam as necessidades dos consumidores
                nacionais e internacionais.
              </p>
            </div>

            <div className="rounded-2xl border border-[#f0e5d5] bg-[#fffdf8] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Eye
                  size={19}
                  className="text-[#166534]"
                />

                <h3 className="font-extrabold text-[#382515]">
                  Visão
                </h3>
              </div>

              <p className="text-sm leading-7 text-[#806b55]">
                Ser uma marca de referência em Moçambique e no
                mercado internacional na produção, processamento
                e comercialização de castanhas, reconhecida pela
                qualidade dos seus produtos, inovação,
                responsabilidade social e compromisso com o
                desenvolvimento sustentável das comunidades
                produtoras.
              </p>
            </div>

          </section>

          {/* Valores */}
          <section className="border-t border-[#f0e5d5] pt-6">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck
                size={21}
                className="text-[#166534]"
              />

              <h3 className="font-extrabold text-[#382515]">
                Valores
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {[
                [
                  'Respeito',
                  'Valorização dos produtores, colaboradores, clientes e parceiros.',
                ],
                [
                  'Integridade',
                  'Ética, transparência e honestidade em todas as relações.',
                ],
                [
                  'Responsabilidade',
                  'Compromisso com a qualidade, a segurança alimentar e o meio ambiente.',
                ],
                [
                  'Trabalho em Equipa',
                  'Colaboração, união e eficiência para alcançar resultados.',
                ],
                [
                  'Liderança',
                  'Excelência na produção, processamento e comercialização de castanhas.',
                ],
                [
                  'Inovação',
                  'Melhoria contínua dos processos, produtos e tecnologias de processamento.',
                ],
                [
                  'Qualidade',
                  'Oferecemos castanhas processadas com elevados padrões de qualidade e segurança alimentar.',
                ],
                [
                  'Compromisso',
                  'Foco na satisfação dos clientes, valorização dos produtores e desenvolvimento sustentável das comunidades.',
                ],
              ].map(([titulo, descricao]) => (
                <div
                  key={titulo}
                  className="rounded-xl border border-[#f0e5d5] bg-[#fffdf8] p-4"
                >
                  <p className="text-sm font-extrabold text-[#166534]">
                    {titulo}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-[#806b55]">
                    {descricao}
                  </p>
                </div>
              ))}

            </div>
          </section>

          {/* Contactos */}
          <section className="grid grid-cols-1 gap-3 border-t border-[#f0e5d5] pt-6 text-sm text-[#806b55] md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-[#fffdf8] p-4">
              <MapPin
                size={19}
                className="mt-0.5 shrink-0 text-[#166534]"
              />

              <span>
                Lab de Hardware & Hub Logístico:
                <strong className="ml-1 text-[#382515]">
                  Maputo e Matola
                </strong>
              </span>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-[#fffdf8] p-4">
              <Mail
                size={19}
                className="mt-0.5 shrink-0 text-[#166534]"
              />

              <span className="break-all">
                castanhasaninha@gmail.com
              </span>
            </div>
          </section>

          {/* Equipa de trabalho */}
          <section className="space-y-5 border-t border-[#f0e5d5] pt-6">
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-[#382515]">
                Equipa de Trabalho
              </h3>

              <p className="mt-1 text-xs text-[#806b55]">
                Pessoas responsáveis pelo desenvolvimento
                e funcionamento da iniciativa.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#e7d5b8] bg-[#fffdf8] p-5">
              <div className="flex min-w-[570px] items-end justify-center gap-3 md:gap-5">

                {RESPONSAVEIS.map((resp) => (
                  <div
                    key={resp.id}
                    className="group flex w-[90px] shrink-0 flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 md:w-[115px]"
                  >
                    {/* Fotografia */}
                    <div
                      className={`relative overflow-hidden rounded-full border border-[#e7d5b8] bg-white shadow-md ${resp.tamanhoClass}`}
                    >
                      <Image
                        src={resp.imagem}
                        alt={resp.nome}
                        fill
                        sizes="144px"
                        className="rounded-full object-cover p-1"
                      />
                    </div>

                    {/* Informações */}
                    <div className="mt-3 w-full space-y-1">
                      <p
                        className={`font-extrabold leading-tight ${
                          resp.id === 3
                            ? 'text-xs text-amber-700 md:text-sm'
                            : 'text-[10px] text-[#382515] md:text-xs'
                        }`}
                      >
                        {resp.nome}
                      </p>

                      <p className="truncate text-[10px] font-semibold text-[#806b55] md:text-xs">
                        {resp.cargo}
                      </p>

                      <p className="hidden text-[10px] leading-4 text-[#a58b6d] md:block">
                        {resp.responsabilidade}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </section>

        </section>

        {/* Rodapé */}
        <footer className="pb-4 text-center text-xs text-[#a58b6d]">
          © {new Date().getFullYear()} Castanha de Caju.
          Todos os direitos reservados.
        </footer>

      </div>
    </main>
  )
}