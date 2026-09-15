'use client'

import { useState } from 'react'
import {
  X,
  User,
  Phone,
  MapPin,
  Package,
  MessageSquare,
  Send,
} from 'lucide-react'

import type { MedidorGrandeVolume } from '../types/medidor'

interface PedidoGrandeVolumeProps {
  volumeSelecionado: MedidorGrandeVolume | null
  onFechar: () => void
}

export default function PedidoGrandeVolume({
  volumeSelecionado,
  onFechar,
}: PedidoGrandeVolumeProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [localizacao, setLocalizacao] = useState('')

  const [quantidade, setQuantidade] = useState(
    volumeSelecionado
      ? String(volumeSelecionado.quantidade)
      : ''
  )

  const [unidade, setUnidade] = useState('kg')

  const [mensagem, setMensagem] = useState('')

  const enviarPedido = (e: React.FormEvent) => {
    e.preventDefault()

    const texto = `
PEDIDO DE CASTANHAS NÃO PROCESSADAS

Nome: ${nome}
Telefone: ${telefone}
Localização: ${localizacao}
Quantidade: ${quantidade} ${unidade}

Volume selecionado:
${
  volumeSelecionado
    ? volumeSelecionado.nome
    : 'Quantidade personalizada'
}

Mensagem:
${mensagem || 'Nenhuma mensagem adicional.'}
    `.trim()

    const textoCodificado = encodeURIComponent(texto)

    window.open(
      `https://wa.me/258870873423?text=${textoCodificado}`,
      '_blank'
    )
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/75
        p-0
        backdrop-blur-sm
        md:items-center
        md:p-6
      "
    >
      <div
        className="
          relative
          max-h-[95vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-t-3xl
          border
          border-white/10
          bg-[#181818]
          p-5
          text-white
          shadow-2xl
          md:rounded-3xl
          md:p-7
        "
      >
        {/* FECHAR */}
        <button
          type="button"
          onClick={onFechar}
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/5
            text-gray-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <X size={19} />
        </button>

        {/* CABEÇALHO */}
        <div className="pr-12">
          <div
            className="
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-green-500/10
              text-green-500
            "
          >
            <Package size={25} />
          </div>

          <h2 className="text-2xl font-black">
            Solicitar grande volume
          </h2>

          <p className="mt-2 text-sm leading-5 text-gray-400">
            Preencha os seus dados para solicitar
            castanhas de caju não processadas.
          </p>
        </div>

        {/* VOLUME SELECIONADO */}
        <div
          className="
            mt-5
            rounded-xl
            border
            border-green-500/20
            bg-green-500/5
            p-4
          "
        >
          <p className="text-xs font-semibold text-gray-500">
            Volume solicitado
          </p>

          <p className="mt-1 text-lg font-black text-green-500">
            {volumeSelecionado
              ? volumeSelecionado.nome
              : 'Quantidade personalizada'}
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={enviarPedido}
          className="mt-6"
        >
          {/* NOME */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold text-gray-300">
              Nome
            </label>

            <div className="relative">
              <User
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                required
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                placeholder="Seu nome"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-green-500
                "
              />
            </div>
          </div>

          {/* TELEFONE */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold text-gray-300">
              Telefone
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                required
                type="tel"
                value={telefone}
                onChange={(e) =>
                  setTelefone(e.target.value)
                }
                placeholder="+258 ..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-green-500
                "
              />
            </div>
          </div>

          {/* LOCALIZAÇÃO */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold text-gray-300">
              Localização
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                required
                value={localizacao}
                onChange={(e) =>
                  setLocalizacao(e.target.value)
                }
                placeholder="Cidade, bairro ou local"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-green-500
                "
              />
            </div>
          </div>

          {/* QUANTIDADE */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold text-gray-300">
              Quantidade
            </label>

            <div className="flex gap-2">
              <input
                required
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(e.target.value)
                }
                placeholder="Quantidade"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-green-500
                "
              />

              <select
                value={unidade}
                onChange={(e) =>
                  setUnidade(e.target.value)
                }
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  px-4
                  text-sm
                  font-bold
                  text-white
                  outline-none
                  focus:border-green-500
                "
              >
                <option value="kg">kg</option>
                <option value="toneladas">
                  toneladas
                </option>
                <option value="sacos">sacos</option>
                <option value="latas">latas</option>
              </select>
            </div>
          </div>

          {/* MENSAGEM */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-gray-300">
              Observações
            </label>

            <div className="relative">
              <MessageSquare
                size={18}
                className="
                  absolute
                  left-4
                  top-4
                  text-gray-500
                "
              />

              <textarea
                rows={4}
                value={mensagem}
                onChange={(e) =>
                  setMensagem(e.target.value)
                }
                placeholder="Descreva outras necessidades do seu pedido..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-white/10
                  bg-[#111111]
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-green-500
                "
              />
            </div>
          </div>

          {/* ENVIAR */}
          <button
            type="submit"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-5
              py-4
              text-sm
              font-black
              text-white
              transition
              hover:bg-green-700
              active:scale-[0.98]
            "
          >
            <Send size={18} />
            Enviar pedido
          </button>
        </form>
      </div>
    </div>
  )
}