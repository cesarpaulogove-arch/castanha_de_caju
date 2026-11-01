import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/* =========================================================
   TIPOS
========================================================= */

type ItemRecebido = {
  produtoId?: string | number
  produtoNome?: string
  nome?: string
  quantidade?: string | number
  precoUnitario?: string | number
  desconto?: string | number
  total?: string | number
}

type BodyCompra = {
  nome?: string
  nomeCliente?: string

  telefone?: string
  telefoneCliente?: string

  email?: string
  distrito?: string
  bairro?: string

  latitude?: string | number
  longitude?: string | number

  entregadorNome?: string
  nomeEntregador?: string

  entregadorTelefone?: string
  telefoneEntregador?: string

  subtotal?: string | number
  desconto?: string | number
  taxaEntrega?: string | number
  total?: string | number

  quantidadeTotalKg?: string | number
  totalKg?: string | number

  itens?: ItemRecebido[]
}

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function texto(valor: unknown): string {
  return String(valor ?? '').trim()
}

function numero(valor: unknown, padrao = 0): number {
  if (valor === null || valor === undefined || valor === '') {
    return padrao
  }

  const n = Number(valor)

  return Number.isFinite(n) ? n : padrao
}

/**
 * Normaliza telefone moçambicano.
 *
 * Aceita:
 * 82xxxxxxx
 * 83xxxxxxx
 * 84xxxxxxx
 * 85xxxxxxx
 * 86xxxxxxx
 * 87xxxxxxx
 *
 * Também aceita +258xxxxxxxxx ou 258xxxxxxxxx.
 */
function normalizarTelefone(valor: unknown): string {
  let telefone = texto(valor)

  telefone = telefone.replace(/[^\d]/g, '')

  if (telefone.startsWith('258')) {
    telefone = telefone.slice(3)
  }

  return telefone
}

/**
 * Verifica se o telefone possui formato moçambicano.
 */
function telefoneValido(telefone: string): boolean {
  return /^[82-87]\d{8}$/.test(telefone)
}

/**
 * Converte coordenadas para número.
 */
function coordenada(
  valor: unknown,
  nome: string,
): number {
  const n = Number(valor)

  if (!Number.isFinite(n)) {
    throw new Error(`${nome} inválida.`)
  }

  return n
}

/* =========================================================
   POST /api/compras
========================================================= */

export async function POST(request: NextRequest) {
  try {
    /* =====================================================
       1. LER BODY
    ===================================================== */

    let body: BodyCompra

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'O corpo da requisição não contém JSON válido.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       2. DADOS DO CLIENTE
    ===================================================== */

    const nomeCliente = texto(
      body.nomeCliente ?? body.nome,
    )

    const telefoneCliente = normalizarTelefone(
      body.telefoneCliente ?? body.telefone,
    )

    const email = texto(body.email) || null
    const distrito = texto(body.distrito) || null
    const bairro = texto(body.bairro) || null

    if (!nomeCliente) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'O nome do cliente é obrigatório.',
        },
        { status: 400 },
      )
    }

    if (!telefoneCliente) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'O telefone do cliente é obrigatório.',
        },
        { status: 400 },
      )
    }

    if (!telefoneValido(telefoneCliente)) {
      return NextResponse.json(
        {
          sucesso: false,
          erro:
            'Telefone inválido. Use um número moçambicano válido, por exemplo 84XXXXXXX.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       3. GPS
    ===================================================== */

    let latitude: number
    let longitude: number

    try {
      latitude = coordenada(
        body.latitude,
        'Latitude',
      )

      longitude = coordenada(
        body.longitude,
        'Longitude',
      )
    } catch (erro) {
      return NextResponse.json(
        {
          sucesso: false,
          erro:
            erro instanceof Error
              ? erro.message
              : 'Coordenadas inválidas.',
        },
        { status: 400 },
      )
    }

    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Latitude fora do intervalo permitido.',
        },
        { status: 400 },
      )
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Longitude fora do intervalo permitido.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       4. ENTREGADOR
    ===================================================== */

    const nomeEntregador = texto(
      body.nomeEntregador ?? body.entregadorNome,
    )

    const telefoneEntregador = texto(
      body.telefoneEntregador ??
        body.entregadorTelefone,
    ) || null

    if (!nomeEntregador) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'O entregador é obrigatório.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       5. VALORES DA COMPRA
    ===================================================== */

    const subtotal = numero(body.subtotal)
    const desconto = numero(body.desconto)
    const taxaEntrega = numero(body.taxaEntrega)
    const total = numero(body.total)

    const quantidadeTotalKg = numero(
      body.quantidadeTotalKg ?? body.totalKg,
    )

    if (subtotal < 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Subtotal inválido.',
        },
        { status: 400 },
      )
    }

    if (desconto < 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Desconto inválido.',
        },
        { status: 400 },
      )
    }

    if (taxaEntrega < 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Taxa de entrega inválida.',
        },
        { status: 400 },
      )
    }

    if (total < 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'Total inválido.',
        },
        { status: 400 },
      )
    }

    if (quantidadeTotalKg <= 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro:
            'A quantidade total em kg deve ser maior que zero.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       6. ITENS
    ===================================================== */

    if (!Array.isArray(body.itens) || body.itens.length === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: 'A compra precisa possuir pelo menos um item.',
        },
        { status: 400 },
      )
    }

    /* =====================================================
       7. PRODUTO REAL
       
       O frontend pode enviar produtoId "1", mas não vamos
       confiar nesse ID.

       O produto comercial é:
       Castanha de Caju
    ===================================================== */

    let produtoReal = await prisma.produto.findFirst({
      where: {
        nome: {
          equals: 'Castanha de Caju',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        nome: true,
        unidade: true,
        ativo: true,
      },
    })

    /* =====================================================
       8. CRIAR PRODUTO SE NÃO EXISTIR
    ===================================================== */

    if (!produtoReal) {
      produtoReal = await prisma.produto.create({
        data: {
          nome: 'Castanha de Caju',
          unidade: 'kg',
          ativo: true,
        },
        select: {
          id: true,
          nome: true,
          unidade: true,
          ativo: true,
        },
      })
    }

    /* =====================================================
       9. REATIVAR PRODUTO
    ===================================================== */

    if (!produtoReal.ativo) {
      produtoReal = await prisma.produto.update({
        where: {
          id: produtoReal.id,
        },
        data: {
          ativo: true,
        },
        select: {
          id: true,
          nome: true,
          unidade: true,
          ativo: true,
        },
      })
    }

    /* =====================================================
       10. PREPARAR ITENS DA COMPRA
    ===================================================== */

    const itensCompra = body.itens.map((item, index) => {
      const quantidade = numero(item.quantidade)
      const precoUnitario = numero(item.precoUnitario)
      const descontoItem = numero(item.desconto)
      const totalItem = numero(item.total)

      if (quantidade <= 0) {
        throw new Error(
          `Quantidade inválida no item ${index + 1}.`,
        )
      }

      if (precoUnitario < 0) {
        throw new Error(
          `Preço inválido no item ${index + 1}.`,
        )
      }

      if (descontoItem < 0) {
        throw new Error(
          `Desconto inválido no item ${index + 1}.`,
        )
      }

      if (totalItem < 0) {
        throw new Error(
          `Total inválido no item ${index + 1}.`,
        )
      }

      /**
       * O produtoNome fica como descrição da apresentação
       * comprada.
       *
       * Exemplo:
       * Copo
       * B. Médio
       * B. Grande
       */
      const nomeApresentacao =
        texto(
          item.produtoNome ??
            item.nome,
        ) || produtoReal.nome

      return {
        produtoId: produtoReal.id,
        produtoNome: nomeApresentacao,
        quantidade,
        precoUnitario,
        desconto: descontoItem,
        total: totalItem,
      }
    })

    /* =====================================================
       11. LOCALIZAR OU CRIAR CLIENTE
       
       O telefone é UNIQUE no schema.
    ===================================================== */

    let cliente = await prisma.cliente.findUnique({
      where: {
        telefone: telefoneCliente,
      },
    })

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome: nomeCliente,
          telefone: telefoneCliente,
          email,
          distrito,
          bairro,
          latitude,
          longitude,
          ativo: true,
        },
      })
    } else {
      /**
       * Atualiza os dados do cliente sempre que ele
       * fizer uma nova compra.
       */
      cliente = await prisma.cliente.update({
        where: {
          id: cliente.id,
        },
        data: {
          nome: nomeCliente,
          email,
          distrito,
          bairro,
          latitude,
          longitude,
          ativo: true,
        },
      })
    }

    /* =====================================================
       12. LOCALIZAR ENTREGADOR
    ===================================================== */

    const entregador = await prisma.usuario.findFirst({
      where: {
        nome: {
          equals: nomeEntregador,
          mode: 'insensitive',
        },
        perfil: 'ENTREGADOR',
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
      },
    })

    if (!entregador) {
      return NextResponse.json(
        {
          sucesso: false,
          erro:
            `O entregador "${nomeEntregador}" não foi encontrado ou está inactivo.`,
        },
        { status: 400 },
      )
    }

    /* =====================================================
       13. CRIAR COMPRA
       
       Os ItemCompra são criados junto com a Compra.
       
       Não usamos:
       prisma.$transaction(async ...)
       
       Isso evita o P2028 que ocorreu no PostgreSQL.
    ===================================================== */

    const compra = await prisma.compra.create({
      data: {
        clienteId: cliente.id,

        nomeCliente: nomeCliente,
        telefoneCliente: telefoneCliente,

        distritoEntrega: distrito,
        bairroEntrega: bairro,

        latitudeEntrega: latitude,
        longitudeEntrega: longitude,

        entregadorId: entregador.id,
        nomeEntregador: entregador.nome,
        telefoneEntregador:
          telefoneEntregador ??
          entregador.telefone ??
          null,

        subtotal,
        desconto,
        taxaEntrega,
        total,
        quantidadeTotalKg,

        estado: 'PENDENTE',

        itens: {
          create: itensCompra,
        },
      },

      include: {
        cliente: true,

        entregador: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            perfil: true,
            ativo: true,
          },
        },

        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    /* =====================================================
       14. RESPOSTA
    ===================================================== */

    return NextResponse.json(
      {
        sucesso: true,

        mensagem:
          'Compra registada com sucesso.',

        compra: {
          id: compra.id,

          estado: compra.estado,

          dataCompra: compra.dataCompra,

          cliente: {
            id: compra.cliente?.id ?? cliente.id,
            nome: compra.nomeCliente,
            telefone: compra.telefoneCliente,
            email: cliente.email,
            distrito: compra.distritoEntrega,
            bairro: compra.bairroEntrega,
            latitude: compra.latitudeEntrega,
            longitude: compra.longitudeEntrega,
          },

          entregador: compra.entregador
            ? {
                id: compra.entregador.id,
                nome: compra.entregador.nome,
                telefone:
                  compra.entregador.telefone,
                ativo: compra.entregador.ativo,
              }
            : null,

          valores: {
            subtotal: compra.subtotal,
            desconto: compra.desconto,
            taxaEntrega: compra.taxaEntrega,
            total: compra.total,
            quantidadeTotalKg:
              compra.quantidadeTotalKg,
          },

          itens: compra.itens.map((item) => ({
            id: item.id,
            produtoId: item.produtoId,
            produtoNome: item.produtoNome,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            desconto: item.desconto,
            total: item.total,
          })),
        },

        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          distrito: cliente.distrito,
          bairro: cliente.bairro,
          latitude: cliente.latitude,
          longitude: cliente.longitude,
          ativo: cliente.ativo,
          createdAt: cliente.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (erro) {
    console.error(
      'ERRO AO REGISTAR COMPRA:',
      erro,
    )

    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Não foi possível registar a compra.',

        detalhe:
          erro instanceof Error
            ? erro.message
            : 'Erro desconhecido.',
      },
      { status: 500 },
    )
  }
}

/* =========================================================
   GET /api/compras
   Lista compras
========================================================= */

export async function GET() {
  try {
    const compras = await prisma.compra.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        cliente: true,

        entregador: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            perfil: true,
            ativo: true,
          },
        },

        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    return NextResponse.json({
      sucesso: true,
      compras,
    })
  } catch (erro) {
    console.error(
      'ERRO AO LISTAR COMPRAS:',
      erro,
    )

    return NextResponse.json(
      {
        sucesso: false,
        erro: 'Não foi possível carregar as compras.',
      },
      { status: 500 },
    )
  }
}