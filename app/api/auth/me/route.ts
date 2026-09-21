
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

export async function GET() {
  try {
    const cookieStore = await cookies()

    const token = cookieStore.get(SESSION_COOKIE)?.value

    /*
     * ======================================================
     * SEM COOKIE
     * ======================================================
     */

    if (!token) {
      return NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        { status: 401 }
      )
    }

    const tokenHash = gerarHashToken(token)

    /*
     * ======================================================
     * PROCURAR SESSÃO
     * ======================================================
     *
     * IMPORTANTE:
     *
     * A sessão do GESTOR não possui usuarioId.
     *
     * Portanto:
     *
     * GESTOR
     *   usuarioId = null
     *   tipo = GESTOR
     *
     * UTILIZADOR
     *   usuarioId = ID do Usuario
     *   tipo = UTILIZADOR
     */

    const sessao = await prisma.sessao.findUnique({
      where: {
        tokenHash,
      },
      include: {
        usuario: true,
      },
    })

    /*
     * ======================================================
     * SESSÃO NÃO ENCONTRADA
     * ======================================================
     */

    if (!sessao) {
      return NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        { status: 401 }
      )
    }

    /*
     * ======================================================
     * SESSÃO EXPIRADA
     * ======================================================
     */

    if (sessao.expiraEm <= new Date()) {
      await prisma.sessao.delete({
        where: {
          id: sessao.id,
        },
      })

      const resposta = NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        { status: 401 }
      )

      resposta.cookies.delete(SESSION_COOKIE)

      return resposta
    }

    /*
     * ======================================================
     * GESTOR PRINCIPAL
     * ======================================================
     *
     * O gestor NÃO existe na tabela Usuario.
     *
     * Ele é reconhecido através de:
     *
     * GESTOR_EMAIL
     * GESTOR_PASSWORD
     *
     * definidos no .env.
     *
     * A sessão do gestor possui:
     *
     * tipo = GESTOR
     * usuarioId = null
     */

    if (sessao.tipo === 'GESTOR') {
      const gestorEmail = process.env.GESTOR_EMAIL
        ?.trim()
        .toLowerCase()

      /*
       * Por segurança, a sessão de gestor só é
       * considerada válida se o email do gestor
       * continuar configurado no servidor.
       */

      if (!gestorEmail) {
        console.error(
          'GESTOR_EMAIL não está configurado no .env'
        )

        await prisma.sessao.delete({
          where: {
            id: sessao.id,
          },
        })

        const resposta = NextResponse.json(
          {
            autenticado: false,
            usuario: null,
          },
          { status: 401 }
        )

        resposta.cookies.delete(SESSION_COOKIE)

        return resposta
      }

      /*
       * IMPORTANTE:
       *
       * Não tentamos acessar:
       *
       * sessao.usuario.ativo
       *
       * porque o gestor não possui Usuario.
       */

      return NextResponse.json({
        autenticado: true,
        usuario: {
          nome: 'Gestor Principal',
          email: gestorEmail,
          perfil: 'GESTOR',
        },
      })
    }

    /*
     * ======================================================
     * UTILIZADOR NORMAL
     * ======================================================
     *
     * A partir daqui esperamos uma sessão do tipo
     * UTILIZADOR com um usuario associado.
     */

    if (!sessao.usuario) {
      console.error(
        'Sessão de utilizador sem Usuario associado:',
        sessao.id
      )

      await prisma.sessao.delete({
        where: {
          id: sessao.id,
        },
      })

      const resposta = NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        { status: 401 }
      )

      resposta.cookies.delete(SESSION_COOKIE)

      return resposta
    }

    /*
     * ======================================================
     * CONTA DESATIVADA
     * ======================================================
     */

    if (!sessao.usuario.ativo) {
      return NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        { status: 403 }
      )
    }

    /*
     * ======================================================
     * UTILIZADOR AUTENTICADO
     * ======================================================
     */

    return NextResponse.json({
      autenticado: true,
      usuario: {
        id: sessao.usuario.id,
        nome: sessao.usuario.nome,
        telefone: sessao.usuario.telefone,
        email: sessao.usuario.email,
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
      },
      { status: 500 }
    )
  }
}

