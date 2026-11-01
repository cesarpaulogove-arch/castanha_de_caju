import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

function normalizarTelefone(telefone: string) {
  return telefone.replace(/\D/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const telefoneParam =
      request.nextUrl.searchParams.get('telefone')

    if (!telefoneParam) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Telefone não informado.',
        },
        { status: 400 }
      )
    }

    const telefone =
      normalizarTelefone(telefoneParam)

    if (
      !telefone ||
      telefone.length !== 9
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Telefone inválido.',
        },
        { status: 400 }
      )
    }

    const cliente =
      await prisma.cliente.findUnique({
        where: {
          telefone,
        },

        select: {
          id: true,
          nome: true,
          telefone: true,
          email: true,
          distrito: true,
          bairro: true,
          latitude: true,
          longitude: true,
          ativo: true,
          createdAt: true,
          updatedAt: true,
        },
      })

    if (!cliente) {
      return NextResponse.json({
        sucesso: true,
        encontrado: false,
        cliente: null,
      })
    }

    return NextResponse.json({
      sucesso: true,
      encontrado: true,
      cliente,
    })
  } catch (error) {
    console.error(
      'ERRO AO PROCURAR CLIENTE:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível procurar o cliente.',
      },
      { status: 500 }
    )
  }
}