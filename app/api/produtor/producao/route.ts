
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { obterProdutorAutenticado } from '@/lib/auth-user'

export async function GET() {
  try {
    const produtor =
      await obterProdutorAutenticado()

    if (!produtor) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Acesso não autorizado.',
        },
        { status: 401 }
      )
    }

    const producoes =
      await prisma.producao.findMany({
        where: {
          produtorId: produtor.id,
        },
        include: {
          produto: true,
        },
        orderBy: {
          dataProducao: 'desc',
        },
      })

    return NextResponse.json({
      sucesso: true,
      producoes,
    })
  } catch (error) {
    console.error(
      'ERRO AO LISTAR PRODUÇÕES:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível carregar as produções.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const produtor =
      await obterProdutorAutenticado()

    if (!produtor) {
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
      body?.dataProducao

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

    let dataProducao = new Date()

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
              'A data de produção é inválida.',
          },
          { status: 400 }
        )
      }

      dataProducao = dataConvertida
    }

    const produtoExistente =
      await prisma.produto.findFirst({
        where: {
          nome: {
            equals: produtoNome,
            mode: 'insensitive',
          },
        },
      })

    const produto =
      produtoExistente ??
      await prisma.produto.create({
        data: {
          nome: produtoNome,
          unidade: 'kg',
        },
      })

    const lote = await gerarNumeroLote(
      produtor.id
    )

    const producao =
      await prisma.producao.create({
        data: {
          produtorId: produtor.id,
          produtoId: produto.id,
          lote,
          quantidade,
          quantidadeDisponivel: quantidade,
          dataProducao,
        },
        include: {
          produto: true,
          produtor: {
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
          'Produção registada com sucesso.',
        producao,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      'ERRO AO REGISTAR PRODUÇÃO:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível registar a produção.',
      },
      { status: 500 }
    )
  }
}

async function gerarNumeroLote(
  produtorId: number
) {
  const prefixo = `P${produtorId}`

  const ultimaProducao =
    await prisma.producao.findFirst({
      where: {
        produtorId,
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        lote: true,
      },
    })

  let numero = 1

  if (ultimaProducao?.lote) {
    const partes =
      ultimaProducao.lote.split('-')

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

