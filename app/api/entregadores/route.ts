
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const entregadores = await prisma.usuario.findMany({
      where: {
        perfil: 'ENTREGADOR',
        ativo: true,
        online: true,
        latitude: {
          not: null,
        },
        longitude: {
          not: null,
        },
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

    const resultado = entregadores
      .map((entregador) => {
        const latitude =
          entregador.latitude !== null
            ? Number(entregador.latitude)
            : NaN

        const longitude =
          entregador.longitude !== null
            ? Number(entregador.longitude)
            : NaN

        return {
          id: entregador.id,
          nome: entregador.nome,
          telefone: entregador.telefone,
          latitude,
          longitude,
          online: entregador.online,
          ultimaAtualizacao:
            entregador.localizacaoAtualizada?.toISOString() ?? null,
        }
      })
      .filter((entregador) =>
        Number.isFinite(entregador.latitude) &&
        Number.isFinite(entregador.longitude) &&
        entregador.latitude >= -90 &&
        entregador.latitude <= 90 &&
        entregador.longitude >= -180 &&
        entregador.longitude <= 180 &&
        (entregador.latitude !== 0 || entregador.longitude !== 0)
      )

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Erro ao consultar entregadores:', error)

    return NextResponse.json(
      { mensagem: 'Erro ao consultar entregadores.' },
      { status: 500 },
    )
  }
}
