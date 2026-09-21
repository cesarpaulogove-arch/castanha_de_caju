import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { Perfil } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const email = process.env.GESTOR_EMAIL
    const password = process.env.GESTOR_PASSWORD

    if (!email || !password) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'GESTOR_EMAIL e GESTOR_PASSWORD não estão configurados no .env.',
        },
        { status: 500 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'A senha do gestor deve ter pelo menos 8 caracteres.',
        },
        { status: 500 }
      )
    }

    const emailNormalizado = email.trim().toLowerCase()

    const gestorExistente = await prisma.usuario.findUnique({
      where: {
        email: emailNormalizado,
      },
    })

    if (gestorExistente) {
      if (gestorExistente.perfil !== Perfil.GESTOR) {
        return NextResponse.json(
          {
            sucesso: false,
            mensagem:
              'O email configurado para o gestor já pertence a outro perfil.',
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
        email: emailNormalizado,
        telefone: null,
        localizacao: 'Maputo',
        senha: senhaHash,
        perfil: Perfil.GESTOR,
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
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