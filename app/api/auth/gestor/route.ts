
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { Perfil } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const telefone = process.env.GESTOR_TELEFONE
    const password = process.env.GESTOR_PASSWORD

    if (!telefone || !password) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'GESTOR_TELEFONE e GESTOR_PASSWORD não estão configurados no .env.',
        },
        { status: 500 }
      )
    }

    const telefoneNormalizado = telefone.replace(/\D/g, '')

    if (!/^\d{9}$/.test(telefoneNormalizado)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'O número de telemóvel deve ter 9 dígitos.',
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'A senha deve ter pelo menos 8 caracteres.',
        },
        { status: 400 }
      )
    }

    const gestorExistente = await prisma.usuario.findFirst({
      where: {
        telefone: telefoneNormalizado,
      },
    })

    if (gestorExistente) {
      if (gestorExistente.perfil !== Perfil.GESTOR) {
        return NextResponse.json(
          {
            sucesso: false,
            mensagem:
              'Este número já pertence a uma conta com outro perfil.',
          },
          { status: 409 }
        )
      }

      return NextResponse.json({
        sucesso: true,
        mensagem: 'A conta do gestor já existe.',
      })
    }

    const senhaHash = await bcrypt.hash(password, 12)

    const gestor = await prisma.usuario.create({
      data: {
        nome: 'Gestor Principal',
        telefone: telefoneNormalizado,
        localizacao: 'Maputo',
        senha: senhaHash,
        perfil: Perfil.GESTOR,
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        perfil: true,
        ativo: true,
      },
    })

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: 'Gestor principal criado com sucesso.',
        gestor,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('ERRO AO CRIAR GESTOR:', error)

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível criar o gestor.',
      },
      { status: 500 }
    )
  }
}
