
'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  Tag,
  X,
  CheckCircle,
  ShoppingCart,
} from 'lucide-react'

import FormularioEntrega from './formulario/FormularioEntrega'

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÕES
|--------------------------------------------------------------------------
*/

const PRECO_BASE_COPO = 175.90
const KG_POR_COPO = 0.5

const DESCONTO_GROSSISTA = 0.05
const QUANTIDADE_DESCONTO = 10

/*
|--------------------------------------------------------------------------
| TIPOS
|--------------------------------------------------------------------------
*/

interface ItemCarrinho {
  produtoId: string
  quantidade: number
}

interface Entregador {
  id: number
  nome: string
  telefone: string | null

  /*
   * São opcionais porque a API atual ainda pode
   * devolver apenas id, nome e telefone.
   *
   * Quando o GPS for ligado ao banco, estas propriedades
   * poderão ser utilizadas automaticamente.
   */
  latitude?: number | null
  longitude?: number | null
  online?: boolean
  velocidade?: number | null
  ultimaAtualizacao?: string | null
  foto?: string | null
}

interface EntregadorSorteado {
  nome: string
  foto?: string
}

interface CarrinhoProps {
  itens: ItemCarrinho[]

  medidorSelecionado:
    | 'copo'
    | 'balde-medio'
    | 'balde-grande'

  aoLimparCarrinho?: () => void
  aoResetarCatalogo?: () => void
}

/*
|--------------------------------------------------------------------------
| DISTÂNCIA HAVERSINE
|--------------------------------------------------------------------------
*/

function calcularDistancia(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  const raioTerra = 6371

  const diferencaLatitude =
    ((latitude2 - latitude1) * Math.PI) / 180

  const diferencaLongitude =
    ((longitude2 - longitude1) * Math.PI) / 180

  const a =
    Math.sin(diferencaLatitude / 2) *
      Math.sin(diferencaLatitude / 2) +
    Math.cos(
      (latitude1 * Math.PI) / 180,
    ) *
      Math.cos(
        (latitude2 * Math.PI) / 180,
      ) *
      Math.sin(diferencaLongitude / 2) *
      Math.sin(diferencaLongitude / 2)

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )

  return raioTerra * c
}

/*
|--------------------------------------------------------------------------
| COMPONENTE
|--------------------------------------------------------------------------
*/

export default function Carrinho({
  itens,
  medidorSelecionado,
  aoLimparCarrinho,
  aoResetarCatalogo,
}: CarrinhoProps) {

  /*
  |--------------------------------------------------------------------------
  | ENTREGADORES
  |--------------------------------------------------------------------------
  */

  const [
    entregadores,
    setEntregadores,
  ] = useState<Entregador[]>([])

  const [
    carregandoEntregadores,
    setCarregandoEntregadores,
  ] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | ESTADOS DO CLIENTE
  |--------------------------------------------------------------------------
  */

  const [
    clienteEncontrado,
    setClienteEncontrado,
  ] = useState(false)

  const [
    clienteConsultado,
    setClienteConsultado,
  ] = useState(false)

  const [
    aProcurarCliente,
    setAProcurarCliente,
  ] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | ESTADOS DO FORMULÁRIO
  |--------------------------------------------------------------------------
  */

  const [
    formularioAberto,
    setFormularioAberto,
  ] = useState(false)

  const [
    sucesso,
    setSucesso,
  ] = useState(false)

  const [
    estaAProcessar,
    setEstaAProcessar,
  ] = useState(false)

  const [
    nome,
    setNome,
  ] = useState('')

  const [
    distrito,
    setDistrito,
  ] = useState('')

  const [
    bairro,
    setBairro,
  ] = useState('')

  const [
    telefone,
    setTelefone,
  ] = useState('')

  const [
    entregadorSorteado,
    setEntregadorSorteado,
  ] = useState<EntregadorSorteado | null>(
    null,
  )

  /*
  |--------------------------------------------------------------------------
  | CARREGAR ENTREGADORES DO BANCO
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller =
      new AbortController()

    async function carregarEntregadores() {
      try {
        setCarregandoEntregadores(true)

        const resposta =
          await fetch(
            '/api/entregadores',
            {
              method: 'GET',
              cache: 'no-store',
              signal:
                controller.signal,
            },
          )

        const texto =
          await resposta.text()

        let dados: unknown = null

        try {
          dados = texto
            ? JSON.parse(texto)
            : null
        } catch {
          dados = null
        }

        if (!resposta.ok) {
          throw new Error(
            typeof dados === 'object' &&
              dados !== null &&
              'mensagem' in dados
              ? String(
                  (
                    dados as {
                      mensagem?: unknown
                    }
                  ).mensagem ??
                    'Não foi possível carregar os entregadores.',
                )
              : 'Não foi possível carregar os entregadores.',
          )
        }

        if (!Array.isArray(dados)) {
          throw new Error(
            'A API de entregadores devolveu um formato inválido.',
          )
        }

        const lista =
          dados.filter(
            (
              item,
            ): item is Entregador =>
              typeof item === 'object' &&
              item !== null &&
              typeof (
                item as {
                  id?: unknown
                }
              ).id === 'number' &&
              typeof (
                item as {
                  nome?: unknown
                }
              ).nome === 'string',
          )

        setEntregadores(lista)
      } catch (erro) {
        if (
          erro instanceof Error &&
          erro.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'ERRO AO CARREGAR ENTREGADORES:',
          erro,
        )

        setEntregadores([])
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setCarregandoEntregadores(
            false,
          )
        }
      }
    }

    carregarEntregadores()

    return () => {
      controller.abort()
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | TOTAL DE ITENS
  |--------------------------------------------------------------------------
  */

  const totalItensCarrinho =
    itens.reduce(
      (total, item) =>
        total +
        Math.max(
          0,
          Number(item.quantidade) || 0,
        ),
      0,
    )

  /*
  |--------------------------------------------------------------------------
  | VALORES
  |--------------------------------------------------------------------------
  */

  const valorTotalCarrinho =
    totalItensCarrinho *
    PRECO_BASE_COPO

  const desconto =
    totalItensCarrinho >=
    QUANTIDADE_DESCONTO
      ? valorTotalCarrinho *
        DESCONTO_GROSSISTA
      : 0

  const taxaEntrega = 0

  const totalAPagar =
    valorTotalCarrinho -
    desconto +
    taxaEntrega

  const pesoTotalKg =
    totalItensCarrinho *
    KG_POR_COPO

  /*
  |--------------------------------------------------------------------------
  | DISCRIMINAÇÃO DOS ITENS
  |--------------------------------------------------------------------------
  */

  const discriminacaoItens = () => {
    let quantidadeRestante =
      totalItensCarrinho

    const resultado: Array<{
      label: string
      quantidade: number
      precoUnitario: number
      preco: number
    }> = []

    const quantidadeBaldeGrande =
      Math.floor(
        quantidadeRestante / 40,
      )

    if (quantidadeBaldeGrande > 0) {
      resultado.push({
        label: 'B. Grande (20kg)',
        quantidade:
          quantidadeBaldeGrande,
        precoUnitario:
          PRECO_BASE_COPO * 40,
        preco:
          quantidadeBaldeGrande *
          PRECO_BASE_COPO *
          40,
      })

      quantidadeRestante -=
        quantidadeBaldeGrande * 40
    }

    const quantidadeBaldeMedio =
      Math.floor(
        quantidadeRestante / 10,
      )

    if (quantidadeBaldeMedio > 0) {
      resultado.push({
        label: 'B. Médio (5kg)',
        quantidade:
          quantidadeBaldeMedio,
        precoUnitario:
          PRECO_BASE_COPO * 10,
        preco:
          quantidadeBaldeMedio *
          PRECO_BASE_COPO *
          10,
      })

      quantidadeRestante -=
        quantidadeBaldeMedio * 10
    }

    if (quantidadeRestante > 0) {
      resultado.push({
        label: 'Copos',
        quantidade:
          quantidadeRestante,
        precoUnitario:
          PRECO_BASE_COPO,
        preco:
          quantidadeRestante *
          PRECO_BASE_COPO,
      })
    }

    return resultado
  }

  /*
  |--------------------------------------------------------------------------
  | PROCURAR CLIENTE
  |--------------------------------------------------------------------------
  */

  async function procurarCliente(
    telefoneRecebido?: string,
  ) {
    const telefoneAtual = (
      telefoneRecebido ??
      telefone
    ).replace(/\D/g, '')

    if (telefoneAtual.length !== 9) {
      setClienteConsultado(false)
      setClienteEncontrado(false)
      return
    }

    setAProcurarCliente(true)
    setClienteConsultado(false)
    setClienteEncontrado(false)

    try {
      const resposta =
        await fetch(
          `/api/clientes?telefone=${encodeURIComponent(
            telefoneAtual,
          )}`,
          {
            method: 'GET',
            cache: 'no-store',
          },
        )

      const texto =
        await resposta.text()

      let dados: any = null

      try {
        dados = texto
          ? JSON.parse(texto)
          : null
      } catch {
        dados = null
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            'Não foi possível procurar o cliente.',
        )
      }

      if (
        dados?.sucesso &&
        dados?.encontrado &&
        dados?.cliente
      ) {
        const cliente =
          dados.cliente

        setNome(
          cliente.nome ?? '',
        )

        setTelefone(
          cliente.telefone ??
            telefoneAtual,
        )

        setDistrito(
          cliente.distrito ?? '',
        )

        setBairro(
          cliente.bairro ?? '',
        )

        setClienteEncontrado(true)
        setClienteConsultado(true)

        return
      }

      setClienteEncontrado(false)
      setClienteConsultado(true)

      setNome('')
      setDistrito('')
      setBairro('')
    } catch (erro) {
      console.error(
        'ERRO AO PROCURAR CLIENTE:',
        erro,
      )

      setClienteEncontrado(false)
      setClienteConsultado(true)

      alert(
        erro instanceof Error
          ? erro.message
          : 'Erro ao procurar cliente.',
      )
    } finally {
      setAProcurarCliente(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ABRIR FORMULÁRIO
  |--------------------------------------------------------------------------
  */

  function abrirFormulario() {
    if (totalItensCarrinho <= 0) {
      alert(
        'Adicione pelo menos um produto ao carrinho.',
      )

      return
    }

    setClienteConsultado(false)
    setClienteEncontrado(false)
    setAProcurarCliente(false)

    setNome('')
    setDistrito('')
    setBairro('')
    setTelefone('')

    setEntregadorSorteado(null)

    setSucesso(false)
    setEstaAProcessar(false)

    setFormularioAberto(true)
  }

  /*
  |--------------------------------------------------------------------------
  | FECHAR FORMULÁRIO
  |--------------------------------------------------------------------------
  */

  function fecharFormulario() {
    if (estaAProcessar) {
      return
    }

    setFormularioAberto(false)

    setClienteConsultado(false)
    setClienteEncontrado(false)
    setAProcurarCliente(false)

    setNome('')
    setDistrito('')
    setBairro('')
    setTelefone('')

    setEntregadorSorteado(null)
  }

  /*
  |--------------------------------------------------------------------------
  | FINALIZAR SUCESSO
  |--------------------------------------------------------------------------
  */

  function finalizarSucesso() {
    setSucesso(false)
    setFormularioAberto(false)

    setClienteConsultado(false)
    setClienteEncontrado(false)
    setAProcurarCliente(false)

    setNome('')
    setDistrito('')
    setBairro('')
    setTelefone('')

    setEntregadorSorteado(null)

    aoLimparCarrinho?.()
    aoResetarCatalogo?.()

    setEstaAProcessar(false)
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMISSÃO DO PEDIDO
  |--------------------------------------------------------------------------
  */

  async function gerirSubmissao(
    evento: React.FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault()

    if (estaAProcessar) {
      return
    }

    const nomeLimpo =
      nome.trim()

    const distritoLimpo =
      distrito.trim()

    const bairroLimpo =
      bairro.trim()

    const telefoneNormalizado =
      telefone.replace(/\D/g, '')

    if (
      telefoneNormalizado.length !== 9
    ) {
      alert(
        'Introduza um número de WhatsApp válido com 9 dígitos.',
      )

      return
    }

    if (!clienteEncontrado) {
      if (!nomeLimpo) {
        alert(
          'Introduza o nome do cliente.',
        )

        return
      }

      if (!distritoLimpo) {
        alert(
          'Selecione o distrito.',
        )

        return
      }

      if (!bairroLimpo) {
        alert(
          'Selecione o bairro.',
        )

        return
      }
    }

    /*
    |--------------------------------------------------------------------------
    | GEOLOCALIZAÇÃO DO CLIENTE
    |--------------------------------------------------------------------------
    */

    if (
      typeof navigator ===
        'undefined' ||
      !navigator.geolocation
    ) {
      alert(
        'O seu navegador não suporta geolocalização.',
      )

      return
    }

    setEstaAProcessar(true)

    try {
      const posicao =
        await new Promise<GeolocationPosition>(
          (
            resolve,
            reject,
          ) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy:
                  true,
                timeout: 15000,
                maximumAge: 0,
              },
            )
          },
        )

      const latitude =
        posicao.coords.latitude

      const longitude =
        posicao.coords.longitude

      /*
      |--------------------------------------------------------------------------
      | ENTREGADORES VINDOS DO BANCO
      |--------------------------------------------------------------------------
      */

      if (
        carregandoEntregadores
      ) {
        throw new Error(
          'Ainda estamos a carregar os entregadores. Tente novamente.',
        )
      }

      if (
        entregadores.length === 0
      ) {
        throw new Error(
          'Não existem entregadores activos registados no sistema.',
        )
      }

      /*
      |--------------------------------------------------------------------------
      | PROCURAR ENTREGADORES COM GPS
      |--------------------------------------------------------------------------
      */

      const entregadoresComDistancia =
        entregadores
          .map((entregador) => {
            const latitudeEntregador =
              Number(
                entregador.latitude,
              )

            const longitudeEntregador =
              Number(
                entregador.longitude,
              )

            if (
              !Number.isFinite(
                latitudeEntregador,
              ) ||
              !Number.isFinite(
                longitudeEntregador,
              )
            ) {
              return null
            }

            return {
              entregador,
              distancia:
                calcularDistancia(
                  latitude,
                  longitude,
                  latitudeEntregador,
                  longitudeEntregador,
                ),
            }
          })
          .filter(
            (
              item,
            ): item is {
              entregador: Entregador
              distancia: number
            } =>
              item !== null,
          )

      let entregador: Entregador

      /*
      |--------------------------------------------------------------------------
      | SE EXISTIR GPS
      |--------------------------------------------------------------------------
      |
      | Selecionamos o entregador mais próximo.
      |
      */

      if (
        entregadoresComDistancia.length >
        0
      ) {
        entregadoresComDistancia.sort(
          (a, b) =>
            a.distancia -
            b.distancia,
        )

        entregador =
          entregadoresComDistancia[0]
            .entregador
      } else {
        /*
        |--------------------------------------------------------------------------
        | SEM GPS
        |--------------------------------------------------------------------------
        |
        | A API atual só fornece:
        | id, nome e telefone.
        |
        | Portanto não tentamos inventar
        | uma localização.
        |
        | Selecionamos um entregador
        | disponível da lista.
        |
        */

        const indice =
          Math.floor(
            Math.random() *
              entregadores.length,
          )

        entregador =
          entregadores[indice]
      }

      /*
      |--------------------------------------------------------------------------
      | GUARDAR VISUALMENTE O ENTREGADOR
      |--------------------------------------------------------------------------
      */

      setEntregadorSorteado({
        nome:
          entregador.nome,

        foto:
          entregador.foto ??
          undefined,
      })

      /*
      |--------------------------------------------------------------------------
      | ITENS DA COMPRA
      |--------------------------------------------------------------------------
      */

      const itensCompra =
        discriminacaoItens().map(
          (item) => ({
            produtoNome:
              item.label,

            quantidade:
              item.quantidade,

            precoUnitario:
              item.precoUnitario,

            desconto: 0,

            total:
              item.preco,
          }),
        )

      /*
      |--------------------------------------------------------------------------
      | PAYLOAD
      |--------------------------------------------------------------------------
      */

      const payload = {
        nome:
          nomeLimpo,

        telefone:
          telefoneNormalizado,

        distrito:
          distritoLimpo,

        bairro:
          bairroLimpo,

        latitude,

        longitude,

        entregadorNome:
          entregador.nome,

        entregadorTelefone:
          entregador.telefone ??
          null,

        subtotal:
          valorTotalCarrinho,

        desconto,

        taxaEntrega,

        total:
          totalAPagar,

        quantidadeTotalKg:
          pesoTotalKg,

        itens:
          itensCompra,
      }

      console.log(
        'ENVIANDO COMPRA:',
        payload,
      )

      /*
      |--------------------------------------------------------------------------
      | GRAVAR COMPRA
      |--------------------------------------------------------------------------
      */

      const resposta =
        await fetch(
          '/api/compras',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              payload,
            ),
          },
        )

      const texto =
        await resposta.text()

      let dados: any = null

      try {
        dados = texto
          ? JSON.parse(texto)
          : null
      } catch {
        dados = null
      }

      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
            dados?.error ||
            `Erro ao criar pedido (${resposta.status}).`,
        )
      }

      if (
        dados &&
        dados.sucesso === false
      ) {
        throw new Error(
          dados.mensagem ||
            'A compra não foi registada.',
        )
      }

      setSucesso(true)
    } catch (erro) {
      console.error(
        'ERRO AO FINALIZAR PEDIDO:',
        erro,
      )

      alert(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível finalizar o pedido.',
      )

      setEntregadorSorteado(null)
    } finally {
      setEstaAProcessar(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CONSULTA AUTOMÁTICA DO CLIENTE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const telefoneNormalizado =
      telefone.replace(/\D/g, '')

    if (
      telefoneNormalizado.length !== 9
    ) {
      setClienteConsultado(false)
      setClienteEncontrado(false)

      return
    }

    let cancelado = false

    async function consultarAutomaticamente() {
      if (cancelado) {
        return
      }

      await procurarCliente(
        telefoneNormalizado,
      )
    }

    const temporizador =
      window.setTimeout(
        consultarAutomaticamente,
        350,
      )

    return () => {
      cancelado = true

      window.clearTimeout(
        temporizador,
      )
    }
  }, [telefone])

  /*
  |--------------------------------------------------------------------------
  | CARRINHO VAZIO
  |--------------------------------------------------------------------------
  */

  if (totalItensCarrinho <= 0) {
    return null
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* =====================================================
          CARRINHO
      ====================================================== */}

      <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        {/* ===================================================
            CABEÇALHO
        ==================================================== */}

        <div className="relative h-40 overflow-hidden">

          <img
            src="/castanha_familia.jpeg"
            alt="Carrinho de compras"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-between p-5">

            <div>

              <div className="flex items-center gap-2 text-white">

                <ShoppingCart
                  size={24}
                />

                <h2 className="text-2xl font-black">
                  Carrinha de Compras
                </h2>

              </div>

              <p className="mt-1 text-sm text-white/80">
                {totalItensCarrinho}{' '}
                {totalItensCarrinho === 1
                  ? 'item'
                  : 'itens'}{' '}
                no carrinho
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                aoLimparCarrinho?.()
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Limpar carrinho"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* ===================================================
            CONTEÚDO
        ==================================================== */}

        <div className="p-5">

          {/* PESO / DESCONTO */}

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">

                <Tag
                  size={20}
                  className="text-emerald-600"
                />

              </div>

              <div>

                <p className="text-xs text-slate-500">
                  Peso total
                </p>

                <p className="font-bold text-slate-900">
                  {pesoTotalKg.toFixed(1)} kg
                </p>

              </div>

            </div>

            {desconto > 0 && (
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                -5% desconto
              </div>
            )}

          </div>

          {/* =================================================
              ITENS
          ================================================== */}

          <div className="mt-4 space-y-2">

            {discriminacaoItens().map(
              (item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                >

                  <div>

                    <p className="font-semibold text-slate-800">
                      {item.label}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.quantidade}{' '}
                      unidade
                      {item.quantidade !== 1
                        ? 's'
                        : ''}
                    </p>

                  </div>

                  <p className="font-bold text-slate-900">

                    {item.preco.toLocaleString(
                      'pt-MZ',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}{' '}
                    MT

                  </p>

                </div>
              ),
            )}

          </div>

          {/* =================================================
              RESUMO
          ================================================== */}

          <div className="mt-5 border-t border-slate-200 pt-4">

            <div className="flex justify-between text-sm text-slate-600">

              <span>
                Subtotal
              </span>

              <span>
                {valorTotalCarrinho.toLocaleString(
                  'pt-MZ',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}{' '}
                MT
              </span>

            </div>

            {desconto > 0 && (
              <div className="mt-2 flex justify-between text-sm text-emerald-600">

                <span>
                  Desconto
                </span>

                <span>
                  -
                  {desconto.toLocaleString(
                    'pt-MZ',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}{' '}
                  MT
                </span>

              </div>
            )}

            <div className="mt-3 flex items-end justify-between">

              <span className="text-sm font-semibold text-slate-600">
                Total a pagar
              </span>

              <span className="text-2xl font-black text-emerald-600">
                {totalAPagar.toLocaleString(
                  'pt-MZ',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}{' '}
                MT
              </span>

            </div>

          </div>

          {/* =================================================
              CONFIRMAR
          ================================================== */}

          <button
            type="button"
            onClick={abrirFormulario}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.99]"
          >

            <CheckCircle
              size={21}
            />

            Confirmar e Fechar Pedido

          </button>

        </div>

      </div>

      {/* =====================================================
          FORMULÁRIO
      ====================================================== */}

      <FormularioEntrega
        formularioAberto={
          formularioAberto
        }

        sucesso={
          sucesso
        }

        nome={
          nome
        }

        distrito={
          distrito
        }

        bairro={
          bairro
        }

        telefone={
          telefone
        }

        setNome={
          setNome
        }

        setDistrito={
          setDistrito
        }

        setBairro={
          setBairro
        }

        setTelefone={(valor) => {
          const apenasNumeros =
            valor
              .replace(/\D/g, '')
              .slice(0, 9)

          setTelefone(
            apenasNumeros,
          )

          if (
            apenasNumeros.length !== 9
          ) {
            setClienteConsultado(false)
            setClienteEncontrado(false)
          }
        }}

        clienteEncontrado={
          clienteEncontrado
        }

        clienteConsultado={
          clienteConsultado
        }

        aProcurarCliente={
          aProcurarCliente
        }

        procurarCliente={
          procurarCliente
        }

        gerirSubmissao={
          gerirSubmissao
        }

        fecharFormulario={
          fecharFormulario
        }

        finalizarSucesso={
          finalizarSucesso
        }

        estaAProcessar={
          estaAProcessar
        }

        entregadorSorteado={
          entregadorSorteado
        }
      />

    </>
  )
}
