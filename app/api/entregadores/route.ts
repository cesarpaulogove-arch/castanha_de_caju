import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const entregadores = await prisma.usuario.findMany({
      where: {
        perfil: 'ENTREGADOR',
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        latitude: true,
        longitude: true,
        online: true,
        localizacaoAtualizada: true,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    const resultado = entregadores.map((entregador) => ({
      id: entregador.id,
      nome: entregador.nome,
      telefone: entregador.telefone,

      latitude:
        entregador.latitude !== null
          ? Number(entregador.latitude)
          : null,

      longitude:
        entregador.longitude !== null
          ? Number(entregador.longitude)
          : null,

      online: entregador.online,

      ultimaAtualizacao:
        entregador.localizacaoAtualizada?.toISOString() ?? null,
    }))

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Erro ao consultar entregadores:', error)

    return NextResponse.json(
      {
        mensagem: 'Erro ao consultar entregadores.',
      },
      {
        status: 500,
      },
    )
  }
}