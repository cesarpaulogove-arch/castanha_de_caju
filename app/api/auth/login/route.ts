
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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const emailRecebido = body?.email
    const senhaRecebida = body?.senha

    /*
     * =====================================================
     * VALIDAR DADOS
     * =====================================================
     */

    if (!emailRecebido || !senhaRecebida) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'Informe o email e a palavra-passe.',
        },
        { status: 400 }
      )
    }

    const email = String(emailRecebido)
      .trim()
      .toLowerCase()

    const senha = String(senhaRecebida)

    /*
     * =====================================================
     * 1. VERIFICAR GESTOR PRINCIPAL
     * =====================================================
     *
     * O gestor NÃO precisa existir na tabela Usuario.
     *
     * As credenciais são obtidas do .env:
     *
     * GESTOR_EMAIL
     * GESTOR_PASSWORD
     */

    const gestorEmail = process.env.GESTOR_EMAIL
      ?.trim()
      .toLowerCase()

    const gestorPassword =
      process.env.GESTOR_PASSWORD

    if (
      gestorEmail &&
      gestorPassword &&
      email === gestorEmail &&
      senha === gestorPassword
    ) {
      /*
       * ===================================================
       * CRIAR SESSÃO DO GESTOR
       * ===================================================
       *
       * IMPORTANTE:
       *
       * O gestor não possui Usuario.
       *
       * Portanto:
       *
       * usuarioId = null
       * tipo = GESTOR
       */

      const token = criarTokenSessao()
      const tokenHash = gerarHashToken(token)
      const expiraEm = dataExpiracaoSessao()

      await prisma.sessao.create({
        data: {
          tokenHash,

          /*
           * O gestor não possui registro em Usuario.
           */
          usuarioId: null,

          /*
           * Identifica esta sessão como sessão
           * do gestor principal.
           */
          tipo: TipoSessao.GESTOR,

          expiraEm,
        },
      })

      /*
       * ===================================================
       * RESPOSTA DO GESTOR
       * ===================================================
       */

      const resposta = NextResponse.json(
        {
          sucesso: true,
          mensagem:
            'Login efetuado com sucesso.',
          usuario: {
            nome: 'Gestor Principal',
            email: gestorEmail,
            perfil: Perfil.GESTOR,
          },
        },
        { status: 200 }
      )

      /*
       * ===================================================
       * COOKIE DA SESSÃO
       * ===================================================
       */

      resposta.cookies.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_DURATION / 1000,
        expires: expiraEm,
      })

      return resposta
    }

    /*
     * =====================================================
     * 2. PROCURAR UTILIZADOR NORMAL
     * =====================================================
     */

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    })

    /*
     * =====================================================
     * UTILIZADOR NÃO ENCONTRADO
     * =====================================================
     */

    if (!usuario) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'Email ou palavra-passe incorretos.',
        },
        { status: 401 }
      )
    }

    /*
     * =====================================================
     * CONTA DESATIVADA
     * =====================================================
     */

    if (!usuario.ativo) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'Esta conta está desativada.',
        },
        { status: 403 }
      )
    }

    /*
     * =====================================================
     * VERIFICAR PALAVRA-PASSE
     * =====================================================
     */

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    )

    if (!senhaCorreta) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'Email ou palavra-passe incorretos.',
        },
        { status: 401 }
      )
    }

    /*
     * =====================================================
     * 3. CRIAR SESSÃO DO UTILIZADOR NORMAL
     * =====================================================
     */

    const token = criarTokenSessao()
    const tokenHash = gerarHashToken(token)
    const expiraEm = dataExpiracaoSessao()

    await prisma.sessao.create({
      data: {
        tokenHash,

        /*
         * Utilizador normal possui Usuario.
         */
        usuarioId: usuario.id,

        /*
         * Identifica esta sessão como sessão
         * de utilizador normal.
         */
        tipo: TipoSessao.UTILIZADOR,

        expiraEm,
      },
    })

    /*
     * =====================================================
     * RESPOSTA DO UTILIZADOR
     * =====================================================
     */

    const resposta = NextResponse.json(
      {
        sucesso: true,
        mensagem:
          'Login efetuado com sucesso.',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          telefone: usuario.telefone,
          email: usuario.email,
          localizacao: usuario.localizacao,
          perfil: usuario.perfil,
        },
      },
      { status: 200 }
    )

    /*
     * =====================================================
     * COOKIE DA SESSÃO
     * =====================================================
     */

    resposta.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION / 1000,
      expires: expiraEm,
    })

    return resposta
  } catch (error) {
    console.error(
      'ERRO NO LOGIN:',
      error
    )

    return NextResponse.json(
      {
        sucesso: false,
        mensagem:
          'Não foi possível efetuar o login.',
      },
      { status: 500 }
    )
  }
}

