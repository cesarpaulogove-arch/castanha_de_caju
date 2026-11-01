
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

import { TipoSessao, Perfil } from '@/generated/prisma/enums'

// Normalizar telefone
function normalizarTelefone(valor: string) {
  const numero = valor.trim().replace(/[\s()-]/g, '')

  if (numero.startsWith('+258')) {
    return numero
  }

  if (numero.startsWith('258') && numero.length === 12) {
    return `+${numero}`
  }

  if (numero.length === 9) {
    return `+258${numero}`
  }

  return numero
}

// Resposta para sessão inválida
function respostaNaoAutenticado(status = 401) {
  const resposta = NextResponse.json(
    {
      autenticado: false,
      usuario: null,
    },
    { status }
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

export async function GET() {
  try {
    const cookieStore = await cookies()

    const token = cookieStore.get(SESSION_COOKIE)?.value

    // =====================================================
    // 1. VERIFICAR COOKIE
    // =====================================================

    if (!token) {
      return respostaNaoAutenticado()
    }

    const tokenHash = gerarHashToken(token)

    // =====================================================
    // 2. PROCURAR SESSÃO
    // =====================================================

    const sessao = await prisma.sessao.findUnique({
      where: {
        tokenHash,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            localizacao: true,
            perfil: true,
            ativo: true,
          },
        },
      },
    })

    if (!sessao) {
      return respostaNaoAutenticado()
    }

    // =====================================================
    // 3. VERIFICAR EXPIRAÇÃO
    // =====================================================

    if (sessao.expiraEm <= new Date()) {
      await prisma.sessao.deleteMany({
        where: {
          id: sessao.id,
        },
      })

      return respostaNaoAutenticado()
    }

    // =====================================================
    // 4. GESTOR PRINCIPAL
    // =====================================================

    if (sessao.tipo === TipoSessao.GESTOR) {
      const gestorTelefone = process.env.GESTOR_TELEFONE
        ? normalizarTelefone(process.env.GESTOR_TELEFONE)
        : ''

      const gestorPin = process.env.GESTOR_PIN

      // Verificar configuração do gestor
      if (!gestorTelefone || !gestorPin) {
        console.error(
          'GESTOR_TELEFONE ou GESTOR_PIN não configurado no servidor.'
        )

        await prisma.sessao.deleteMany({
          where: {
            id: sessao.id,
          },
        })

        return respostaNaoAutenticado()
      }

      // A sessão do gestor não deve possuir utilizador associado
      if (sessao.usuarioId !== null) {
        await prisma.sessao.deleteMany({
          where: {
            id: sessao.id,
          },
        })

        return respostaNaoAutenticado()
      }

      return NextResponse.json({
        autenticado: true,
        usuario: {
          nome: 'Gestor Principal',
          telefone: gestorTelefone,
          perfil: Perfil.GESTOR,
        },
      })
    }

    // =====================================================
    // 5. VALIDAR TIPO DE SESSÃO
    // =====================================================

    if (sessao.tipo !== TipoSessao.UTILIZADOR) {
      await prisma.sessao.deleteMany({
        where: {
          id: sessao.id,
        },
      })

      return respostaNaoAutenticado()
    }

    // =====================================================
    // 6. VERIFICAR UTILIZADOR ASSOCIADO
    // =====================================================

    if (!sessao.usuario) {
      await prisma.sessao.deleteMany({
        where: {
          id: sessao.id,
        },
      })

      return respostaNaoAutenticado()
    }

    // =====================================================
    // 7. VERIFICAR ESTADO DA CONTA
    // =====================================================

    if (!sessao.usuario.ativo) {
      await prisma.sessao.deleteMany({
        where: {
          id: sessao.id,
        },
      })

      return respostaNaoAutenticado(403)
    }

    // =====================================================
    // 8. UTILIZADOR AUTENTICADO
    // =====================================================

    return NextResponse.json({
      autenticado: true,
      usuario: {
        id: sessao.usuario.id,
        nome: sessao.usuario.nome,
        telefone: sessao.usuario.telefone,
        localizacao: sessao.usuario.localizacao,
        perfil: sessao.usuario.perfil,
      },
    })

  } catch (error) {
    console.error(
      'ERRO AO VERIFICAR SESSÃO:',
      error
    )

    return NextResponse.json(
      {
        autenticado: false,
        usuario: null,
        mensagem: 'Não foi possível verificar a sessão.',
      },
      { status: 500 }
    )
  }
}
