'use client'

import { useState, useEffect } from 'react'
import {
  Tag,
  X,
  User,
  MapPin,
  Phone,
  CheckCircle
} from 'lucide-react'

import { ENTREGADORES } from '../data/entregadores'

interface ItemCarrinho {
  produtoId: string
  quantidade: number
}

interface CarrinhoProps {
  itens: ItemCarrinho[]
  medidorSelecionado: 'copo' | 'balde-medio' | 'balde-grande'
  aoLimparCarrinho?: () => void
  aoResetarCatalogo?: () => void
}

function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371

  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function useGeolocation() {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
      }
    )
  }, [])

  return {
    latitude,
    longitude
  }
}

export default function Carrinho({
  itens,
  medidorSelecionado,
  aoLimparCarrinho,
  aoResetarCatalogo
}: CarrinhoProps) {

  const produtoFixoId = '1'

  const itemAtivo = itens.find(
    item => item.produtoId === produtoFixoId
  )

  const totalItensCarrinho = itemAtivo
    ? itemAtivo.quantidade
    : 0

  // ==============================
  // PREÇOS
  // ==============================

  const precoBaseCopo = 175.90

  const valorTotalCarrinho =
    totalItensCarrinho * precoBaseCopo

  const aplicaDesconto =
    totalItensCarrinho >= 10

  const desconto =
    aplicaDesconto
      ? valorTotalCarrinho * 0.05
      : 0

  const taxaEntrega =
    totalItensCarrinho > 0 &&
    valorTotalCarrinho < 1500
      ? 0
      : 0

  const totalAPagar =
    (valorTotalCarrinho - desconto) +
    taxaEntrega

  const pesoTotalKg =
    totalItensCarrinho * 0.5

  // ==============================
  // FORMATAÇÃO
  // ==============================

  const formataPreco = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
  }

  // ==============================
  // DISCRIMINAÇÃO DOS PRODUTOS
  // ==============================

  let coposRestantes = totalItensCarrinho

  const qtdBaldesGrandes =
    Math.floor(coposRestantes / 40)

  coposRestantes %= 40

  const qtdBaldesMedios =
    Math.floor(coposRestantes / 10)

  coposRestantes %= 10

  const qtdCoposAvulsos =
    coposRestantes

  const discriminacaoItens = [
    {
      label: 'B.Grande(20kg)',
      quantidade: qtdBaldesGrandes,
      preco: qtdBaldesGrandes * 7036.00
    },
    {
      label: 'B.Médio(5kg)',
      quantidade: qtdBaldesMedios,
      preco: qtdBaldesMedios * 1759.00
    },
    {
      label: 'Copos',
      quantidade: qtdCoposAvulsos,
      preco: qtdCoposAvulsos * 175.90
    }
  ].filter(
    item => item.quantidade > 0
  )

  // ==============================
  // ESTADOS
  // ==============================

  const [formularioAberto, setFormularioAberto] =
    useState(false)

  const [sucesso, setSucesso] =
    useState(false)

  const [estaAProcessar, setEstaAProcessar] =
    useState(false)

  const [nome, setNome] =
    useState('')

  const [distrito, setDistrito] =
    useState('')

  const [bairro, setBairro] =
    useState('')

  const [telefone, setTelefone] =
    useState('')

  const {
    latitude,
    longitude
  } = useGeolocation()

  const [
    entregadorSorteado,
    setEntregadorSorteado
  ] = useState<{
    nome: string
    foto: string
  } | null>(null)

  // ==============================
  // ENVIO DO PEDIDO
  // ==============================

  const gerirSubmissao = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    if (
      !nome ||
      !distrito ||
      !bairro ||
      !telefone ||
      estaAProcessar
    ) {
      return
    }

    setEstaAProcessar(true)

    // ==============================
    // LOCALIZAÇÃO
    // ==============================

    if (
      latitude === null ||
      longitude === null
    ) {
      alert(
        'Não foi possível obter a localização do cliente.'
      )

      setEstaAProcessar(false)

      return
    }

    // ==============================
    // ENCONTRAR ENTREGADOR MAIS PRÓXIMO
    // ==============================

    const entregadoresOnline =
      ENTREGADORES.filter(
        e => e.online
      )

    if (entregadoresOnline.length === 0) {
      alert(
        'Não existem entregadores disponíveis neste momento.'
      )

      setEstaAProcessar(false)

      return
    }

    const entregador =
      entregadoresOnline.reduce(
        (maisProximo, atual) => {

          const distanciaAtual =
            calcularDistancia(
              latitude,
              longitude,
              atual.latitude,
              atual.longitude
            )

          const distanciaMaisProximo =
            calcularDistancia(
              latitude,
              longitude,
              maisProximo.latitude,
              maisProximo.longitude
            )

          return distanciaAtual <
            distanciaMaisProximo
            ? atual
            : maisProximo
        }
      )

    setEntregadorSorteado(entregador)

    // ==============================
    // GOOGLE SCRIPT
    // ==============================

    try {

      const URL_GOOGLE_SCRIPT =
        'https://script.google.com/macros/s/AKfycbxd9REX_kb3el5gArZWfjQEHrgeBdNyFkmsjYA46-wnbDMMVYiWtpeschxB-7H-1m-Q/exec'

      await fetch(
        URL_GOOGLE_SCRIPT,
        {
          method: 'POST',

          mode: 'no-cors',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            nome,

            distrito,

            bairro,

            telefone,

            detalhes:
              discriminacaoItens
                .map(
                  i =>
                    `${i.quantidade}x ${i.label}`
                )
                .join(', '),

            peso:
              `${pesoTotalKg.toFixed(1)} KG`,

            total:
              formataPreco(totalAPagar),

            entregador:
              entregador.nome,

            latitude,

            longitude

          })
        }
      )

    } catch (error) {

      console.error(
        'Erro ao reportar linha e enviar email:',
        error
      )

    } finally {

      setSucesso(true)

      setEstaAProcessar(false)

      setTimeout(() => {
        fecharETodosCamposZerar()
      }, 7000)
    }
  }

  // ==============================
  // RESET
  // ==============================

  const fecharETodosCamposZerar = () => {

    setFormularioAberto(false)

    setSucesso(false)

    setEstaAProcessar(false)

    setNome('')

    setDistrito('')

    setBairro('')

    setTelefone('')

    setEntregadorSorteado(null)

    if (aoLimparCarrinho) {
      aoLimparCarrinho()
    }

    if (aoResetarCatalogo) {
      aoResetarCatalogo()
    }
  }

  // ==============================
  // BAIRROS
  // ==============================

  const bairrosPorDistrito: Record<
    string,
    string[]
  > = {

    KaMpfumo: [
      'Alto Maé A',
      'Alto Maé B',
      'Central A',
      'Central B',
      'Central C',
      'Coop',
      'Malhangalene A',
      'Malhangalene B',
      'Polana-Cimento A',
      'Polana-Cimento B',
      'Sommerschield'
    ],

    Nhlamankulu: [
      'Aeroporto A',
      'Aeroporto B',
      'Chamanculo A',
      'Chamanculo B',
      'Chamanculo C',
      'Chamanculo D',
      'Malanga',
      'Minkadjuine',
      'Munhuana',
      'Unidade 7',
      'Xipamanine'
    ],

    KaMaxakeni: [
      'Mafalala',
      'Maxaquene A',
      'Maxaquene B',
      'Maxaquene C',
      'Maxaquene D',
      'Polana Caniço A',
      'Polana Caniço B',
      'Urbanização'
    ],

    KaMavota: [
      'Albasini',
      'Costa do Sol',
      'F.P.L.M.',
      'Hulene A',
      'Hulene B',
      'Laulane',
      'Mahotas',
      'Mavalane A',
      'Mavalane B',
      'Pescadores',
      'Triângulo'
    ],

    KaMubukwana: [
      'Bagamoyo',
      'George Dimitrov (Benfica)',
      'Inhagoia A',
      'Inhagoia B',
      'Jardim',
      'Luís Cabral',
      'Magoanine A',
      'Magoanine B',
      'Magoanine C',
      'Malhazine',
      'Zimpeto'
    ],

    KaTembe: [
      'Chali',
      'Chamissava',
      'Guachene',
      'Incassane',
      'Inguide'
    ],

    KaNyaka: [
      'Ingwane',
      'Nhaquene',
      'Ribjene'
    ],

    'Matola-Sede': [
      'Centro da Cidade',
      'Fomento',
      'Liberdade',
      'Malhampsene',
      'Mussumbuluco',
      'Ndlavela',
      'Sikwama',
      'Tchumene 1',
      'Tchumene 2',
      'Tchumene 3'
    ],

    Machava: [
      'Bunhiça',
      'Infulene A',
      'KM 15',
      'Machava Bedene',
      'Machava Sede',
      'Machava Socimol',
      'Matola Gare',
      'Trevo'
    ],

    Infulene: [
      'Boquisso A',
      'Boquisso B',
      'Intaka',
      'Kongolote',
      'T3',
      'Vale do Infulene'
    ],

    Boane: [
      'Boane Sede',
      'Campoane',
      'Eduardo Mondlane',
      'Gueguegue',
      'Matola-Rio',
      'Mazzarello'
    ],

    Marracuene: [
      'Marracuene Sede',
      'Bairro Cumbeza',
      'Jardim das Oliveiras',
      'Mali',
      'Michafutene',
      'Ricatla'
    ]
  }

  // ==============================
  // INTERFACE
  // ==============================

    if (totalItensCarrinho === 0) {
    return null
  }


  return (

    <div
      className="
        mt-11
        border border-white/10
        rounded-xl
        p-5
        flex flex-col
        h-full
        min-h-0
        shadow-2xl
        relative
        overflow-hidden
        text-white
        bg-cover
        bg-center
        bg-no-repeat
      "
       style={{
    backgroundImage: "url('/castanha_familia.jpeg')"
  }}
    >

      {/* ==============================
          FUNDO ESCURO
      ============================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/70
          backdrop-blur-[1px]
          z-0
        "
      />

      {/* ==============================
          CONTEÚDO
      ============================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          h-full
          min-h-0
        "
      >

        {/* ==============================
            CABEÇALHO
        ============================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            pb-3.5
            shrink-0
          "
        >

          <h2
            className="
              text-sm
              font-black
              text-gray-200
              tracking-wider
              uppercase
            "
          >
            Carrinha de Compras
          </h2>

          {totalItensCarrinho > 0 && (

            <span
              className="
                text-xs
                bg-amber-500/10
                border
                border-amber-500/20
                px-2.5
                py-1
                rounded-full
                font-black
                text-amber-500
              "
            >
              {pesoTotalKg.toFixed(1)} KG Total
            </span>

          )}

        </div>

        {/* ==============================
            DESCONTO
        ============================== */}

        <div
          className="
            mt-4
            space-y-2.5
            shrink-0
            text-xs
          "
        >

          <div
            className="
              bg-emerald-500/10
              border
              border-emerald-500/20
              rounded-xl
              p-3
              text-emerald-400
              backdrop-blur-sm
            "
          >

            <p
              className="
                font-black
                text-sm
              "
            >
              Desconto de Grossista:
            </p>

            <p
              className="
                text-gray-300
                mt-1
                text-[11px]
              "
            >
              Compre{' '}

              <span
                className="
                  text-emerald-400
                  font-bold
                "
              >
                10 ou mais copos
              </span>{' '}

              no total e ganhe{' '}

              <span
                className="
                  text-emerald-300
                  font-black
                "
              >
                5% de desconto
              </span>.
            </p>

          </div>

        </div>

        {/* ==============================
            ITENS
        ============================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            my-4
            space-y-2
            pr-1
            min-h-[100px]
          "
        >

          {discriminacaoItens.length === 0 ? (

            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
                p-4
              "
            >

              <p
                className="
                  text-sm
                  text-gray-400
                  font-bold
                "
              >
                Nenhum produto na carrinha
              </p>

            </div>

          ) : (

            discriminacaoItens.map(
              (item, index) => (

                <div
                  key={index}
                  className="
                    flex
                    justify-between
                    items-center
                    p-3.5
                    bg-black/30
                    rounded-xl
                    border
                    border-white/10
                    backdrop-blur-sm
                  "
                >

                  <div>

                    <h4
                      className="
                        text-sm
                        font-black
                        text-white
                        tracking-tight
                      "
                    >
                      Castanha Caju
                    </h4>

                    <span
                      className="
                        text-xs
                        text-amber-500
                        font-black
                        block
                        mt-1
                      "
                    >
                      {item.quantidade}x {item.label}
                    </span>

                  </div>

                  <span
                    className="
                      text-sm
                      font-black
                      text-amber-500
                    "
                  >
                    {formataPreco(item.preco)} MT
                  </span>

                </div>

              )
            )

          )}

        </div>

        {/* ==============================
            TOTAL
        ============================== */}

        <div
          className="
            border-t
            border-white/10
            pt-4
            space-y-3
            shrink-0
            text-sm
          "
        >

          {aplicaDesconto && (

            <div
              className="
                flex
                justify-between
                text-emerald-400
                font-bold
                bg-emerald-500/5
                px-2.5
                py-1.5
                rounded-lg
                text-xs
                items-center
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >

                <Tag
                  className="
                    w-3.5
                    h-3.5
                  "
                />

                Desconto (5%):

              </span>

              <span
                className="
                  font-black
                "
              >
                -{formataPreco(desconto)} MT
              </span>

            </div>

          )}

          <div
            className="
              flex
              justify-between
              items-center
              pt-3
              border-t
              border-white/10
            "
          >

            <span
              className="
                text-base
                font-black
                text-white
              "
            >
              Total a Pagar:
            </span>

            <span
              className="
                text-lg
                font-black
                text-amber-500
                tracking-wide
              "
            >
              {formataPreco(totalAPagar)} MT
            </span>

          </div>

        </div>

        {/* ==============================
            BOTÃO CONFIRMAR
        ============================== */}

        <button
          disabled={totalItensCarrinho === 0}
          onClick={() => setFormularioAberto(true)}
          className="
            w-full
            mt-4
            py-3.5
            bg-[#009966]
            hover:bg-[#008055]
            text-white
            font-black
            rounded-xl
            text-sm
            uppercase
            tracking-wider
            disabled:opacity-40
            transition-all
            shrink-0
            shadow-lg
          "
        >
          Confirmar e Fechar Pedido
        </button>

        {/* ==============================
            FORMULÁRIO
        ============================== */}

        {formularioAberto && (

          <div
            className="
              absolute
              inset-0
              bg-black/85
              backdrop-blur-md
              z-20
              flex
              flex-col
              p-5
              overflow-y-auto
            "
          >

            {/* CABEÇALHO FORMULÁRIO */}

            <div
              className="
                flex
                justify-between
                items-center
                shrink-0
                mb-4
              "
            >

              <h3
                className="
                  text-sm
                  font-black
                  uppercase
                  tracking-wider
                  text-gray-200
                "
              >
                Dados de Entrega
              </h3>

              <button
                type="button"
                onClick={fecharETodosCamposZerar}
                className="
                  text-gray-400
                  hover:text-white
                  p-1
                  rounded-lg
                  hover:bg-white/5
                  transition-colors
                "
              >

                <X
                  className="
                    w-5
                    h-5
                  "
                />

              </button>

            </div>

            {!sucesso ? (

              <form
                onSubmit={gerirSubmissao}
                className="
                  flex-1
                  flex
                  flex-col
                  justify-between
                  space-y-4
                "
              >

                <div
                  className="
                    space-y-4
                  "
                >

                  {/* NOME */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-bold
                        text-gray-400
                        mb-1.5
                        uppercase
                      "
                    >
                      Nome Completo
                    </label>

                    <div
                      className="
                        relative
                      "
                    >

                      <User
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          w-4
                          h-4
                          text-gray-500
                        "
                      />

                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) =>
                          setNome(e.target.value)
                        }
                        placeholder="Ex: João Sitoe"
                        className="
                          w-full
                          bg-black/50
                          border
                          border-white/10
                          rounded-xl
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          focus:outline-none
                          focus:border-[#009966]
                          transition-colors
                        "
                      />

                    </div>

                  </div>

                  {/* DISTRITO */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-bold
                        text-gray-400
                        mb-1.5
                        uppercase
                      "
                    >
                      Distrito
                    </label>

                    <div
                      className="
                        relative
                      "
                    >

                      <MapPin
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          w-4
                          h-4
                          text-gray-500
                          z-10
                        "
                      />

                      <select
                        required
                        value={distrito}
                        onChange={(e) => {

                          setDistrito(
                            e.target.value
                          )

                          setBairro('')

                        }}
                        className="
                          w-full
                          bg-black
                          border
                          border-white/10
                          rounded-xl
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          focus:outline-none
                          focus:border-[#009966]
                          transition-colors
                          appearance-none
                          cursor-pointer
                        "
                      >

                        <option
                          value=""
                          disabled
                          hidden
                        >
                          Selecione o Distrito
                        </option>

                        <optgroup
                          label="Cidade de Maputo (Distritos Municipais)"
                          className="
                            bg-[#161616]
                            text-gray-300
                          "
                        >

                          <option value="KaMpfumo">
                            KaMpfumo (DM1)
                          </option>

                          <option value="Nhlamankulu">
                            Nhlamankulu (DM2)
                          </option>

                          <option value="KaMaxakeni">
                            KaMaxakeni (DM3)
                          </option>

                          <option value="KaMavota">
                            KaMavota (DM4)
                          </option>

                          <option value="KaMubukwana">
                            KaMubukwana (DM5)
                          </option>

                          <option value="KaTembe">
                            KaTembe (DM6)
                          </option>

                          <option value="KaNyaka">
                            KaNyaka (DM7)
                          </option>

                        </optgroup>

                        <optgroup
                          label="Província de Maputo"
                          className="
                            bg-[#161616]
                            text-gray-300
                          "
                        >

                          <option value="Matola-Sede">
                            Matola (Posto Sede)
                          </option>

                          <option value="Machava">
                            Matola (Posto da Machava)
                          </option>

                          <option value="Infulene">
                            Matola (Posto do Infulene)
                          </option>

                          <option value="Boane">
                            Boane
                          </option>

                          <option value="Marracuene">
                            Marracuene
                          </option>

                        </optgroup>

                      </select>

                    </div>

                  </div>

                  {/* BAIRRO */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-bold
                        text-gray-400
                        mb-1.5
                        uppercase
                      "
                    >
                      Bairro
                    </label>

                    <div
                      className="
                        relative
                      "
                    >

                      <MapPin
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          w-4
                          h-4
                          text-gray-500
                          z-10
                        "
                      />

                      <select
                        required
                        disabled={!distrito}
                        value={bairro}
                        onChange={(e) =>
                          setBairro(
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          bg-black
                          border
                          border-white/10
                          rounded-xl
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          focus:outline-none
                          focus:border-[#009966]
                          transition-colors
                          appearance-none
                          cursor-pointer
                          disabled:opacity-40
                        "
                      >

                        <option
                          value=""
                          disabled
                          hidden
                        >
                          {distrito
                            ? 'Selecione o Bairro'
                            : 'Selecione primeiro o Distrito'}
                        </option>

                        {(
                          bairrosPorDistrito[
                            distrito
                          ] || []
                        ).map(
                          (nomeBairro) => (

                            <option
                              key={nomeBairro}
                              value={nomeBairro}
                              className="
                                bg-[#161616]
                              "
                            >
                              {nomeBairro}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>

                  {/* TELEFONE */}

                  <div>

                    <label
                      className="
                        block
                        text-xs
                        font-bold
                        text-gray-400
                        mb-1.5
                        uppercase
                      "
                    >
                      Contacto WhatsApp
                    </label>

                    <div
                      className="
                        relative
                      "
                    >

                      <Phone
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          w-4
                          h-4
                          text-gray-500
                        "
                      />

                      <input
                        type="tel"
                        required
                        pattern="^(82|83|84|85|86|87)\d{7}$"
                        maxLength={9}
                        value={telefone}
                        onChange={(e) =>
                          setTelefone(
                            e.target.value
                              .replace(/\D/g, '')
                          )
                        }
                        placeholder="Ex: 847059112"
                        className="
                          w-full
                          bg-black/50
                          border
                          border-white/10
                          rounded-xl
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          focus:outline-none
                          focus:border-[#009966]
                          transition-colors
                          invalid:border-red-500/50
                        "
                      />

                    </div>

                  </div>

                </div>

                {/* BOTÃO ENVIAR */}

                <button
                  type="submit"
                  disabled={estaAProcessar}
                  className="
                    w-full
                    py-3.5
                    bg-[#009966]
                    hover:bg-[#008055]
                    text-white
                    font-black
                    rounded-xl
                    text-sm
                    uppercase
                    tracking-wider
                    disabled:opacity-40
                    transition-all
                    mt-4
                    shadow-lg
                  "
                >
                  {estaAProcessar
                    ? 'A processar pedido...'
                    : 'Confirmar e Enviar Pedido'}
                </button>

              </form>

            ) : (

              /* ==============================
                 SUCESSO
              ============================== */

              <div
                className="
                  flex-1
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  p-6
                  space-y-4
                "
              >

                <CheckCircle
                  className="
                    w-14
                    h-14
                    text-emerald-500
                    shrink-0
                  "
                />

                <h4
                  className="
                    text-lg
                    font-black
                    text-white
                  "
                >
                  Pedido Enviado com Sucesso!
                </h4>

                <p
                  className="
                    text-xs
                    text-gray-400
                    max-w-[250px]
                  "
                >
                  O seu pedido foi recebido e o
                  processamento foi iniciado.
                </p>

                {entregadorSorteado && (

                  <div
                    className="
                      mt-4
                      p-4
                      bg-black/40
                      border
                      border-white/10
                      rounded-xl
                      flex
                      flex-col
                      items-center
                      w-full
                      max-w-[280px]
                      backdrop-blur-sm
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        text-amber-500
                        tracking-wider
                        mb-2
                      "
                    >
                      Entregador Responsável
                    </p>

                    <img
                      src={
                        entregadorSorteado.foto
                      }
                      alt={
                        entregadorSorteado.nome
                      }
                      className="
                        w-16
                        h-16
                        rounded-full
                        border-2
                        border-[#009966]
                        object-cover
                        shadow-md
                        mb-2
                      "
                    />

                    <span
                      className="
                        text-sm
                        font-black
                        text-white
                        tracking-tight
                      "
                    >
                      {
                        entregadorSorteado.nome
                      }
                    </span>

                    <span
                      className="
                        text-[10px]
                        text-gray-500
                        mt-0.5
                      "
                    >
                      A preparar a rota de despacho...
                    </span>

                  </div>

                )}

                <button
                  type="button"
                  onClick={
                    fecharETodosCamposZerar
                  }
                  className="
                    mt-4
                    px-6
                    py-2.5
                    bg-white/5
                    border
                    border-white/10
                    hover:bg-white/10
                    text-white
                    rounded-xl
                    text-xs
                    font-bold
                    transition-all
                  "
                >
                  Fechar Janela
                </button>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  )
}