
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { Perfil, TipoSessao } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  SESSION_DURATION,
  criarTokenSessao,
  gerarHashToken,
  dataExpiracaoSessao,
} from '@/lib/auth-session'

// Normalizar número de telemóvel
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

// Validar número moçambicano
function telefoneValido(telefone: string) {
  return /^\+2588[2-7]\d{7}$/.test(telefone)
}

// Criar cookie de sessão
function adicionarCookie(
  resposta: NextResponse,
  token: string,
  expiraEm: Date
) {
  resposta.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION / 1000,
    expires: expiraEm,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const telefoneRecebido = body?.telefone
    const senhaRecebida = body?.senha

    // VALIDAR DADOS
    if (!telefoneRecebido || !senhaRecebida) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe o número de telemóvel e o PIN.',
        },
        { status: 400 }
      )
    }

    const telefone = normalizarTelefone(
      String(telefoneRecebido)
    )

    const senha = String(senhaRecebida)

    if (!telefoneValido(telefone)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe um número de telemóvel válido.',
        },
        { status: 400 }
      )
    }

    if (!/^\d{4}$/.test(senha)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'O PIN deve conter exactamente 4 dígitos.',
        },
        { status: 400 }
      )
    }

    // =====================================================
    // 1. VERIFICAR GESTOR PRINCIPAL
    // =====================================================

    const gestorTelefoneConfigurado = process.env.GESTOR_TELEFONE
      ? normalizarTelefone(process.env.GESTOR_TELEFONE)
      : ''

    const gestorPin = process.env.GESTOR_PIN

    if (
      gestorTelefoneConfigurado &&
      gestorPin &&
      telefone === gestorTelefoneConfigurado &&
      senha === gestorPin
    ) {
      const token = criarTokenSessao()
      const tokenHash = gerarHashToken(token)
      const expiraEm = dataExpiracaoSessao()

      await prisma.sessao.create({
        data: {
          tokenHash,
          usuarioId: null,
          tipo: TipoSessao.GESTOR,
          expiraEm,
        },
      })

      const resposta = NextResponse.json(
        {
          sucesso: true,
          mensagem: 'Login efectuado com sucesso.',
          usuario: {
            nome: 'Gestor Principal',
            telefone: gestorTelefoneConfigurado,
            perfil: Perfil.GESTOR,
          },
        },
        { status: 200 }
      )

      adicionarCookie(resposta, token, expiraEm)

      return resposta
    }

    // =====================================================
    // 2. PROCURAR UTILIZADOR PELO TELEFONE
    // =====================================================

    const usuario = await prisma.usuario.findUnique({
      where: {
        telefone,
      },
    })

    if (!usuario) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Número de telemóvel ou PIN incorretos.',
        },
        { status: 401 }
      )
    }

    // =====================================================
    // 3. VERIFICAR ESTADO DA CONTA
    // =====================================================

    if (!usuario.ativo) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Esta conta está desativada.',
        },
        { status: 403 }
      )
    }

    // =====================================================
    // 4. VERIFICAR PIN
    // =====================================================

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    )

    if (!senhaCorreta) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Número de telemóvel ou PIN incorretos.',
        },
        { status: 401 }
      )
    }

    // =====================================================
    // 5. CRIAR SESSÃO DO UTILIZADOR
    // =====================================================

    const token = criarTokenSessao()
    const tokenHash = gerarHashToken(token)
    const expiraEm = dataExpiracaoSessao()

    await prisma.sessao.create({
      data: {
        tokenHash,
        usuarioId: usuario.id,
        tipo: TipoSessao.UTILIZADOR,
        expiraEm,
      },
    })

    // =====================================================
    // 6. RESPOSTA
    // =====================================================

    const resposta = NextResponse.json(
      {
        sucesso: true,
        mensagem: 'Login efectuado com sucesso.',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          telefone: usuario.telefone,
          localizacao: usuario.localizacao,
          perfil: usuario.perfil,
        },
      },
      { status: 200 }
    )

    adicionarCookie(resposta, token, expiraEm)

    return resposta

  } catch (error) {
    console.error('ERRO NO LOGIN:', error)

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível efectuar o login.',
      },
      { status: 500 }
    )
  }
}
