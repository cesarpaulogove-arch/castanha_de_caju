
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { obterEntregadorAutenticado } from '@/lib/auth-user'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const entregador = await obterEntregadorAutenticado()

    if (!entregador) {
      return NextResponse.json(
        { mensagem: 'Entregador não autenticado.' },
        { status: 401 },
      )
    }

    const dados = await request.json()

    const latitude = Number(dados.latitude)
    const longitude = Number(dados.longitude)

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180 ||
      (latitude === 0 && longitude === 0)
    ) {
      return NextResponse.json(
        { mensagem: 'Coordenadas GPS inválidas.' },
        { status: 400 },
      )
    }

    const atualizado = await prisma.usuario.update({
      where: {
        id: entregador.id,
      },
      data: {
        latitude,
        longitude,
        localizacaoAtualizada: new Date(),
      },
      select: {
        id: true,
        nome: true,
        latitude: true,
        longitude: true,
        online: true,
        localizacaoAtualizada: true,
      },
    })

    return NextResponse.json({
      mensagem: 'Localização actualizada.',
      entregador: {
        ...atualizado,
        latitude: Number(atualizado.latitude),
        longitude: Number(atualizado.longitude),
      },
    })
  } catch (error) {
    console.error('Erro ao actualizar GPS:', error)

    return NextResponse.json(
      { mensagem: 'Não foi possível actualizar a localização.' },
      { status: 500 },
    )
  }
}
