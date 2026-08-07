'use client'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Cpu, ShieldCheck } from 'lucide-react'

export default function ContactosEmpresa() {
  
  // Função para abrir o WhatsApp oficial com a mensagem atualizada sobre robótica e castanhas
  const abrirWhatsAppSuporte = () => {
    const numeroSuporte = '258847059112'
    const texto = encodeURIComponent('Olá! Gostaria de obter suporte comercial e técnico sobre os projetos de robótica, protótipos inteligentes e lotes de castanhas premium da SIDCode.')
    window.open(`https://wa.me/${numeroSuporte}?text=${texto}`, '_blank')
  }

  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white p-4 flex flex-col justify-start items-center select-none overflow-y-auto relative pt-2 md:pt-4 pb-12">
      
      {/* 🌳 IMAGEM DE CAJOEIRO — TOPO ESQUERDO */}
      <div className="fixed top-0 left-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image 
          src="/cajoeiro_esquerdo.png" 
          alt="Cajoeiro Esquerda" 
          fill 
          sizes="256px"
          className="object-contain object-top-left scale-110" 
          priority
        />
      </div>

      {/* 🌳 IMAGEM DE CAJOEIRO — TOPO DIREITO */}
      <div className="fixed top-0 right-0 w-40 h-40 md:w-64 md:h-64 pointer-events-none select-none z-0 opacity-30 md:opacity-45">
        <Image 
          src="/cajoeiro_direito.png" 
          alt="Cajoeiro Direita" 
          fill 
          sizes="256px"
          className="object-contain object-top-right scale-110" 
          priority
        />
      </div>

      {/* 🍂 DECORAÇÕES LATERAIS DE CASTANHAS */}
      <div className="fixed top-[22%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed top-[55%] -translate-y-1/2 -left-8 md:-left-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed bottom-[10%] -left-6 md:-left-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>

      <div className="fixed top-[22%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed top-[55%] -translate-y-1/2 -right-8 md:-right-12 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl -rotate-45">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>
      <div className="fixed bottom-[10%] -right-6 md:-right-10 w-18 h-18 md:w-28 md:h-28 opacity-20 md:opacity-30 rounded-full overflow-hidden z-0 filter drop-shadow-2xl rotate-12">
        <Image src="/castanha_img.jpg" alt="Caju" fill sizes="112px" className="object-cover" />
      </div>

      {/* CARTÃO PRINCIPAL DE CONTACTOS CORPORATIVOS */}
      <div className="w-full max-w-2xl bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-6 z-10 mt-1">
        
        {/* CABEÇALHO — Contexto Inovação Tecnológica */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wider uppercase text-white">Canais de Engenharia & Suporte</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lab de Prototipagem • Automação Inteligente • Castanhas Premium</p>
          </div>
        </div>

        {/* HORÁRIO DE ATENDIMENTO */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center gap-3 text-xs md:text-sm text-gray-300">
          <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-black text-white uppercase tracking-wider text-[11px]">Horário de Operação e Engenharia:</p>
            <p className="text-gray-400 mt-0.5">Segunda a Sexta: 08:00h às 18:00h • Sábados (Ajuste de Hardware): 08:00h às 13:00h</p>
          </div>
        </div>

        {/* LISTA DE CONTACTOS DIRETOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Linha de Apoio Técnico e Comercial via WhatsApp */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" /> Linha de Engenharia
            </div>
            <p className="text-lg font-black text-white tracking-wide">+258864018233</p>
            <p className="text-[11px] text-gray-500 font-medium">Suporte e atendimento via WhatsApp para integração de hardware.</p>
          </div>

          {/* Departamento Corporativo por E-mail */}
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" /> Depart. Tecnológico
            </div>
            <p className="text-sm font-black text-white truncate tracking-tight">castanhasaninha@gmail.com</p>
            <p className="text-[11px] text-gray-500 font-medium">Propostas formais de prototipagem e parcerias em larga escala.</p>
          </div>

        </div>

        {/* INFRAESTRUTURA E LOCAIS DE DESPACHO */}
        <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider border-b border-white/5 pb-2">
            <MapPin className="w-4 h-4" /> Ecossistema Operacional
          </div>
          
          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
             <p className="text-gray-300">
  <span className="text-white font-black block">Escritório Central & Ponto de Distribuição:</span>
  Bairro de Malhampsene Q2, Av. Samora Machel • Matola, Moçambique
</p>

            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-gray-300">
                <span className="text-white font-black block">Hub de Logística Sul & Lab de Prototipagem:</span>
                Zonas Integradas de Maputo & Cidade da Matola
              </p>
            </div>
          </div>
        </div>

        {/* BOTÃO PREMIUM: DISPARAR WHATSAPP IMEDIATO */}
        <button 
          onClick={abrirWhatsAppSuporte}
          className="w-full py-3.5 bg-[#009966] hover:bg-[#008055] text-white font-black rounded-xl text-xs md:text-sm uppercase tracking-wider transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
        >
          💬 Abrir Conversa Direta no WhatsApp
        </button>

        {/* CRUNCH INFRAESTRUTURA DE SEGURANÇA */}
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-[10px] md:text-[11px] leading-snug">
            Todas as comunicações estabelecidas com os terminais da SIDCode cumprem os critérios de confidencialidade de engenharia de hardware e processamento de encomendas.
          </p>
        </div>

      </div>
    </div>
  )
}
