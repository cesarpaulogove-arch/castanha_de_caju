'use client'
import Image from 'next/image'
import { Briefcase, MapPin, Mail, Cpu, Target, Eye, ShieldCheck } from 'lucide-react'

// 👥 Estrutura de dados da Equipa de Trabalho (Reduzido para 5 pessoas, sem termos de engenharia)
const RESPONSAVEIS = [
  { id: 1, nome: 'ANA PAULO GOVE', cargo: 'Nuts Lead', responsabilidade: 'Inspeção e testes de qualidade', tamanhoClass: 'w-20 h-20 md:w-24 md:h-24 opacity-80', imagem: '/ana.png' },
  { id: 2, nome: 'JULIA F. CUMBI', cargo: 'Dir. Operações', responsabilidade: 'Gestão de processamento', tamanhoClass: 'w-22 h-22 md:w-26 md:h-26 opacity-90', imagem: '/julia.png' },
  
  // CENTRO DA PIRÂMIDE (IMAGEM PRINCIPAL)
  { id: 3, nome: 'CESAR PAULO GOVE', cargo: 'Administrador', responsabilidade: 'Estratégia e Inovação Sul', tamanhoClass: 'w-28 h-28 md:w-36 md:h-36 border-2 border-amber-500 scale-110 z-10 opacity-100', imagem: '/cesar.png' },
  
  { id: 4, nome: 'LIGIA DA JULIA', cargo: 'Aplicações e Soluções', responsabilidade: 'Desenvolvimento de sistemas', tamanhoClass: 'w-22 h-22 md:w-26 md:h-26 opacity-90', imagem: '/ligia.png' },
  { id: 5, nome: 'HELDER MATSINHE', cargo: 'Parceiro Estratégico', responsabilidade: 'Desenvolvimento de circuitos', tamanhoClass: 'w-20 h-20 md:w-24 md:h-24 opacity-80', imagem: '/helder.png' }
]

// 🍂 Constantes de decoração que estavam em falta no seu ficheiro
const DECORACOES_ESQUERDA = [
  { id: 'esq-top', pos: 'top-[22%] -left-6 md:-left-10', rot: '-rotate-12', scale: 'scale-110' },
  { id: 'esq-mid', pos: 'top-[55%] -translate-y-1/2 -left-8 md:-left-12', rot: 'rotate-45', scale: 'scale-125' },
  { id: 'esq-bot', pos: 'bottom-[10%] -left-6 md:-left-10', rot: '-rotate-45', scale: 'scale-100' }
]

const DECORACOES_DIREITA = [
  { id: 'dir-top', pos: 'top-[22%] -right-6 md:-right-10', rot: 'rotate-12', scale: 'scale-110' },
  { id: 'dir-mid', pos: 'top-[55%] -translate-y-1/2 -right-8 md:-right-12', rot: '-rotate-45', scale: 'scale-125' },
  { id: 'dir-bot', pos: 'bottom-[10%] -right-6 md:-right-10', rot: 'rotate-12', scale: 'scale-100' }
]

export default function PerfilEmpresa() {
  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white p-4 flex flex-col justify-start items-center select-none overflow-y-auto relative pt-2 md:pt-4 pb-12">
      
      {/* 🌳 ÁRVORE DE CAJOEIRO — TOPO ESQUERDO */}
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

      {/* 🌳 ÁRVORE DE CAJOEIRO — TOPO DIREITO */}
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

      {/* 🍂 IMAGENS DE CASTANHAS À ESQUERDA */}
      {DECORACOES_ESQUERDA.map((dec) => (
        <div key={dec.id} className={`fixed ${dec.pos} ${dec.rot} ${dec.scale} w-18 h-18 md:w-28 md:h-28 pointer-events-none select-none z-0 opacity-20 md:opacity-30 rounded-full overflow-hidden filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]`}>
          <Image src="/castanha_img.jpg" alt="Caju Deco" fill sizes="112px" className="object-cover" />
        </div>
      ))}

      {/* 🍂 IMAGENS DE CASTANHAS À DIREITA */}
      {DECORACOES_DIREITA.map((dec) => (
        <div key={dec.id} className={`fixed ${dec.pos} ${dec.rot} ${dec.scale} w-18 h-18 md:w-28 md:h-28 pointer-events-none select-none z-0 opacity-20 md:opacity-30 rounded-full overflow-hidden filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]`}>
          <Image src="/castanha_img.jpg" alt="Caju Deco" fill sizes="112px" className="object-cover" />
        </div>
      ))}

      {/* CARTÃO PRINCIPAL CORPORATIVO */}
      <div className="w-full max-w-4xl bg-[#161616]/95 border border-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-8 z-10 mt-1">
        
        {/* CABEÇALHO DO PERFIL */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase text-white">Estratégia Empresarial</h2>
              <p className="text-xs text-gray-400 mt-0.5">Qualidade, Sustentabilidade & Ecossistema Aninha Castanhas Diango</p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-black text-amber-500 uppercase tracking-wider">
            LIGA: 864018233
          </span>
        </div>

        {/* ESTRATÉGIA EMPRESARIAL - TEXTOS DE ESTRATÉGIA */}
        <div className="w-full bg-black/30 border border-white/5 rounded-xl p-5 space-y-5 text-sm leading-relaxed text-gray-300">
          
          {/* Objetivo Geral */}
          <div className="space-y-1.5">
            <p className="font-black text-white text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" /> Objetivo Geral
            </p>
            <p className="text-xs md:text-sm text-gray-300">
              Desenvolver uma cadeia de valor sustentável para o processamento, embalagem e comercialização das <span className="text-amber-500 font-bold">Castanhas Aninha Diango</span>, promovendo produtos de elevada qualidade, agregando valor à produção local, gerando emprego, fortalecendo parcerias estratégicas e contribuindo para o desenvolvimento económico e social de Moçambique.
            </p>
          </div>

          {/* Missão e Visão (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div className="space-y-1">
              <p className="font-black text-white text-sm flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-500" /> Missão
              </p>
              <p className="text-xs text-gray-400">
                Processar, embalar e comercializar castanhas de alta qualidade, garantindo segurança alimentar, inovação, sustentabilidade e excelência no atendimento, valorizando os produtores locais e oferecendo produtos que satisfaçam as necessidades dos consumidores nacionais e internacionais.
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="font-black text-white text-sm flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-500" /> Visão
              </p>
              <p className="text-xs text-gray-400">
                Ser uma marca de referência em Moçambique e no mercado internacional na produção, processamento e comercialização de castanhas, reconhecida pela qualidade dos seus produtos, inovação, responsabilidade social e compromisso com o desenvolvimento sustentável das comunidades produtoras.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <p className="font-black text-white text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Valores
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div><span className="text-amber-500 font-bold">Respeito:</span> Valorização dos produtores, colaboradores, clientes e parceiros.</div>
              <div><span className="text-amber-500 font-bold">Integridade:</span> Ética, transparência e honestidade em todas as relações.</div>
              <div><span className="text-amber-500 font-bold">Responsabilidade:</span> Compromisso com a qualidade, a segurança alimentar e o meio ambiente.</div>
              <div><span className="text-amber-500 font-bold">Trabalho em Equipa:</span> Colaboração, união e eficiência para alcançar resultados.</div>
              <div><span className="text-amber-500 font-bold">Liderança:</span> Excelência na produção, processamento e comercialização de castanhas.</div>
              <div><span className="text-amber-500 font-bold">Inovação:</span> Melhoria contínua dos processos, produtos e tecnologias de processamento.</div>
              <div><span className="text-amber-500 font-bold">Qualidade:</span> Oferecemos castanhas processadas com elevados padrões de qualidade e segurança alimentar.</div>
              <div><span className="text-amber-500 font-bold">Compromisso:</span> Foco na satisfação dos clientes, valorização dos produtores e desenvolvimento sustentável das comunidades.</div>
            </div>
          </div>

          {/* Rodapé de Contactos Interno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Lab de Hardware & Hub Logístico: Maputo & Matola</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-500" /> Contacto: castanhasaninha@gmail.com</span>
          </div>

        </div>

            {/* 📐 ESTRUTURA VISUAL DA EQUIPA DE TRABALHO */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black text-gray-500 tracking-widest uppercase text-center">
            Equipa de Trabalho
          </h3>
          
          <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[250px] overflow-x-auto scrollbar-none">
            <div className="flex items-end justify-center gap-1 md:gap-4 px-2 min-w-[620px] md:min-w-0">
              {RESPONSAVEIS.map((resp) => (
                <div key={resp.id} className="flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105 w-[85px] md:w-[110px] shrink-0">
                  
                  <div className={`relative rounded-full bg-black/50 border border-white/10 overflow-hidden shadow-2xl ${resp.tamanhoClass}`}>
                    <Image src={resp.imagem} alt={resp.nome} fill sizes="144px" className="object-cover p-0.5 rounded-full" />
                  </div>
                  
                  <div className="mt-2.5 space-y-0.5 w-full">
                    <p className={`font-black truncate ${resp.id === 3 ? 'text-xs md:text-sm text-amber-400' : 'text-[10px] md:text-xs text-white'}`}>
                      {resp.nome}
                    </p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 truncate font-semibold">
                      {resp.cargo}
                    </p>
                    <p className="text-[8px] md:text-[9px] text-gray-500 leading-tight hidden md:block">
                      {resp.responsabilidade}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
