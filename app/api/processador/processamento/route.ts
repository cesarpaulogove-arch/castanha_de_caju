
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { obterProcessadorAutenticado } from '@/lib/auth-user'

function gerarLote(
  processadorId: number,
  ultimoLote?: string | null
) {
  const numeroAnterior = ultimoLote
    ? Number(ultimoLote.split('-')[1])
    : 0

  const proximoNumero = numeroAnterior + 1

  return `PR${processadorId}-${String(proximoNumero).padStart(5, '0')}`
}

export async function GET() {
  try {
    const processador = await obterProcessadorAutenticado()

    if (!processador) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Acesso não autorizado.',
        },
        { status: 401 }
      )
    }

    const processamentos = await prisma.processamento.findMany({
      where: {
        processadorId: processador.id,
      },
      include: {
        produto: true,
      },
      orderBy: {
        dataProcessamento: 'desc',
      },
    })

    return NextResponse.json({
      sucesso: true,
      processamentos,
    })
  } catch (error) {
    console.error(
      'ERRO AO LISTAR PROCESSAMENTOS:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível carregar os processamentos.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const processador = await obterProcessadorAutenticado()

    if (!processador) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Acesso não autorizado.',
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const nomeProduto = String(
      body?.produto ?? ''
    ).trim()

    const quantidade = Number(
      body?.quantidade
    )

    const dataRecebida = body?.data

    if (!nomeProduto) {
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
          mensagem: 'Informe uma quantidade válida.',
        },
        { status: 400 }
      )
    }

    let dataProcessamento = new Date()

    if (dataRecebida) {
      const data = new Date(dataRecebida)

      if (Number.isNaN(data.getTime())) {
        return NextResponse.json(
          {
            sucesso: false,
            mensagem: 'A data informada é inválida.',
          },
          { status: 400 }
        )
      }

      dataProcessamento = data
    }

    const produtoExistente =
      await prisma.produto.findFirst({
        where: {
          nome: {
            equals: nomeProduto,
            mode: 'insensitive',
          },
        },
      })

    const produto =
      produtoExistente ??
      (await prisma.produto.create({
        data: {
          nome: nomeProduto,
          unidade: 'kg',
        },
      }))

    const ultimoProcessamento =
      await prisma.processamento.findFirst({
        where: {
          processadorId: processador.id,
        },
        orderBy: {
          id: 'desc',
        },
      })

    const lote = gerarLote(
      processador.id,
      ultimoProcessamento?.lote
    )

    const processamento =
      await prisma.processamento.create({
        data: {
          processadorId: processador.id,
          produtoId: produto.id,
          lote,
          quantidade,
          quantidadeDisponivel: quantidade,
          dataProcessamento,
        },
        include: {
          produto: true,
        },
      })

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: 'Processamento registado com sucesso.',
        processamento,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      'ERRO AO REGISTAR PROCESSAMENTO:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível registar o processamento.',
      },
      { status: 500 }
    )
  }
}

