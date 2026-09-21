import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { obterFornecedorAutenticado } from '@/lib/auth-user'

export async function GET() {
  try {
    const fornecedor =
      await obterFornecedorAutenticado()

    if (!fornecedor) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Acesso não autorizado.',
        },
        { status: 401 }
      )
    }

    const fornecimentos =
      await prisma.fornecimento.findMany({
        where: {
          fornecedorId: fornecedor.id,
        },
        include: {
          produto: true,
        },
        orderBy: {
          dataFornecimento: 'desc',
        },
      })

    return NextResponse.json({
      sucesso: true,
      fornecimentos,
    })
  } catch (error) {
    console.error(
      'ERRO AO LISTAR FORNECIMENTOS:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível carregar os fornecimentos.',
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request
) {
  try {
    const fornecedor =
      await obterFornecedorAutenticado()

    if (!fornecedor) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Acesso não autorizado.',
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const produtoNome = String(
      body?.produtoNome ?? ''
    ).trim()

    const quantidade = Number(
      body?.quantidade
    )

    const dataRecebida =
      body?.dataFornecimento

    if (!produtoNome) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe o produto.',
        },
        { status: 400 }
      )
    }

    if (
      !Number.isFinite(quantidade) ||
      quantidade <= 0
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'Informe uma quantidade válida.',
        },
        { status: 400 }
      )
    }

    let dataFornecimento = new Date()

    if (dataRecebida) {
      const dataConvertida =
        new Date(dataRecebida)

      if (
        Number.isNaN(
          dataConvertida.getTime()
        )
      ) {
        return NextResponse.json(
          {
            sucesso: false,
            mensagem:
              'A data do fornecimento é inválida.',
          },
          { status: 400 }
        )
      }

      dataFornecimento =
        dataConvertida
    }

    let produto =
      await prisma.produto.findFirst({
        where: {
          nome: {
            equals: produtoNome,
            mode: 'insensitive',
          },
        },
      })

    if (!produto) {
      produto =
        await prisma.produto.create({
          data: {
            nome: produtoNome,
            unidade: 'kg',
          },
        })
    }

    const lote =
      await gerarNumeroLote(
        fornecedor.id
      )

    const fornecimento =
      await prisma.fornecimento.create({
        data: {
          fornecedorId: fornecedor.id,
          produtoId: produto.id,
          lote,
          quantidade,
          quantidadeDisponivel:
            quantidade,
          dataFornecimento,
        },
        include: {
          produto: true,
          fornecedor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      })

    return NextResponse.json(
      {
        sucesso: true,
        mensagem:
          'Fornecimento registado com sucesso.',
        fornecimento,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      'ERRO AO REGISTAR FORNECIMENTO:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível registar o fornecimento.',
      },
      { status: 500 }
    )
  }
}

async function gerarNumeroLote(
  fornecedorId: number
) {
  const prefixo =
    `F${fornecedorId}`

  const ultimo =
    await prisma.fornecimento.findFirst({
      where: {
        fornecedorId,
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        lote: true,
      },
    })

  let numero = 1

  if (ultimo?.lote) {
    const partes =
      ultimo.lote.split('-')

    const ultimoNumero =
      Number(
        partes[partes.length - 1]
      )

    if (
      Number.isFinite(ultimoNumero)
    ) {
      numero = ultimoNumero + 1
    }
  }

  return `${prefixo}-${String(numero).padStart(5, '0')}`
}

