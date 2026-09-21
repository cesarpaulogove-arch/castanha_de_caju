
'use client'

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react'

export default function ContactosEmpresa() {
  const abrirWhatsAppSuporte = () => {
    const numeroSuporte = '258847059112'

    const texto = encodeURIComponent(
      'Olá! Gostaria de obter suporte comercial e informações sobre os produtos e serviços da Castanha de Caju.'
    )

    window.open(
      `https://wa.me/${numeroSuporte}?text=${texto}`,
      '_blank'
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#fff8e8] px-4 py-6 font-sans text-[#382515] md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Cabeçalho */}
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#166534] shadow-md">
            <MessageCircle
              size={28}
              className="text-white"
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Contactos
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806b55]">
            Entre em contacto connosco. Estamos disponíveis
            para esclarecer dúvidas e apoiar as suas necessidades.
          </p>
        </header>

        {/* Cartão principal */}
        <section className="space-y-6 rounded-3xl border border-[#e7d5b8] bg-white p-5 shadow-[0_15px_45px_rgba(92,64,32,0.08)] sm:p-8">

          {/* Título */}
          <div className="flex items-center gap-3 border-b border-[#f0e5d5] pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#166534]">
              <Building2 size={23} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#382515]">
                Canais de Atendimento
              </h2>

              <p className="mt-1 text-xs text-[#806b55]">
                Atendimento comercial e suporte ao cliente
              </p>
            </div>
          </div>

          {/* Horário de atendimento */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#e7d5b8] bg-[#fffdf8] p-4">
            <Clock
              size={21}
              className="mt-0.5 shrink-0 text-[#166534]"
            />

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#382515]">
                Horário de Atendimento
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#806b55]">
                Segunda a sexta-feira: 08:00h às 18:00h
                <br />
                Sábados: 08:00h às 13:00h
              </p>
            </div>
          </div>

          {/* Contactos diretos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Telefone */}
            <div className="rounded-2xl border border-[#e7d5b8] bg-[#fffdf8] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#166534]">
                <Phone size={18} />
                Telefone
              </div>

              <p className="text-lg font-extrabold tracking-wide text-[#382515]">
                +258 864 018 233
              </p>

              <p className="mt-2 text-xs leading-5 text-[#806b55]">
                Contacto para informações e atendimento.
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-[#e7d5b8] bg-[#fffdf8] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#166534]">
                <Mail size={18} />
                Email
              </div>

              <p className="break-all text-sm font-extrabold text-[#382515]">
                castanhasaninha@gmail.com
              </p>

              <p className="mt-2 text-xs leading-5 text-[#806b55]">
                Contacto para propostas e comunicações formais.
              </p>
            </div>

          </div>

          {/* Localização */}
          <div className="rounded-2xl border border-[#e7d5b8] bg-[#fffdf8] p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[#f0e5d5] pb-3 text-xs font-extrabold uppercase tracking-wide text-[#166534]">
              <MapPin size={18} />
              Localização
            </div>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#166534]" />

                <div>
                  <h3 className="text-sm font-extrabold text-[#382515]">
                    Escritório Central e Ponto de Distribuição
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#806b55]">
                    Bairro de Malhampsene Q2, Avenida Samora
                    Machel, Matola, Moçambique.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#166534]" />

                <div>
                  <h3 className="text-sm font-extrabold text-[#382515]">
                    Operações e Distribuição
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#806b55]">
                    Zonas integradas de Maputo e Cidade da Matola.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* WhatsApp */}
          <button
            onClick={abrirWhatsAppSuporte}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#166534] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#14532d]"
          >
            <MessageCircle size={20} />
            Conversar pelo WhatsApp
          </button>

          {/* Confidencialidade */}
          <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#166534]"
            />

            <p className="text-xs leading-5 text-green-800">
              Valorizamos a confiança, a transparência e o
              respeito em todas as comunicações com os nossos
              clientes e parceiros.
            </p>
          </div>

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