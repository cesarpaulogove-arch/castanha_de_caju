
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'

import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

export async function obterUtilizadorAutenticado() {
  const cookieStore = await cookies()

  const token = cookieStore.get(
    SESSION_COOKIE
  )?.value

  if (!token) {
    return null
  }

  const tokenHash = gerarHashToken(token)

  const sessao = await prisma.sessao.findUnique({
    where: {
      tokenHash,
    },
    include: {
      usuario: true,
    },
  })

  if (!sessao) {
    return null
  }

  if (sessao.expiraEm <= new Date()) {
    await prisma.sessao.delete({
      where: {
        id: sessao.id,
      },
    })

    return null
  }

  if (!sessao.usuario) {
    return null
  }

  if (!sessao.usuario.ativo) {
    return null
  }

  return sessao.usuario
}

export async function obterProdutorAutenticado() {
  const usuario =
    await obterUtilizadorAutenticado()

  if (!usuario) {
    return null
  }

  if (usuario.perfil !== 'PRODUTOR') {
    return null
  }

  return usuario
}


export async function obterFornecedorAutenticado() {
  const usuario =
    await obterUtilizadorAutenticado()

  if (!usuario) {
    return null
  }

  if (usuario.perfil !== 'FORNECEDOR') {
    return null
  }

  return usuario
}

export async function obterProcessadorAutenticado() {
  const usuario = await obterUtilizadorAutenticado()

  if (!usuario) {
    return null
  }

  if (usuario.perfil !== 'PROCESSADOR') {
    return null
  }

  return usuario
}




