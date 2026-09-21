import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

export async function POST() {
  try {
    const cookieStore = await cookies()

    const token = cookieStore.get(SESSION_COOKIE)?.value

    // =========================
    // APAGAR SESSÃO DO BANCO
    // =========================

    if (token) {
      const tokenHash = gerarHashToken(token)

      await prisma.sessao.deleteMany({
        where: {
          tokenHash,
        },
      })
    }

    // =========================
    // APAGAR COOKIE
    // =========================

    const resposta = NextResponse.json({
      sucesso: true,
      mensagem: 'Sessão terminada com sucesso.',
    })

    resposta.cookies.set({
      name: SESSION_COOKIE,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return resposta
  } catch (error) {
    console.error('ERRO AO TERMINAR SESSÃO:', error)

    // Mesmo que haja erro no banco,
    // tentamos remover o cookie do navegador.

    const resposta = NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível terminar a sessão.',
      },
      { status: 500 }
    )

    resposta.cookies.set({
      name: SESSION_COOKIE,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return resposta
  }
}