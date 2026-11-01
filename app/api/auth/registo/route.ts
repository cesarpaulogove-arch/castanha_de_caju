
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Perfil } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

const PERFIS_VALIDOS: Record<string, Perfil> = {
  Produtor: Perfil.PRODUTOR,
  Cliente: Perfil.CLIENTE,
  Entregador: Perfil.ENTREGADOR,
  Fornecedor: Perfil.FORNECEDOR,
  Processador: Perfil.PROCESSADOR,
  Transportador: Perfil.TRANSPORTADOR,
}

function normalizarTexto(valor: string) {
  return valor.trim().replace(/\s+/g, ' ')
}

function normalizarTelefone(telefone: string) {
  return telefone.trim().replace(/\s+/g, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      tipo,
      nome,
      telefone,
      senha,
      localizacao,
    } = body

    // =========================
    // VALIDAR CAMPOS
    // =========================

    if (!tipo || !nome || !telefone || !senha || !localizacao) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Preencha todos os campos obrigatórios.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR PERFIL
    // =========================

    const tipoNormalizado = String(tipo).trim()
    const perfil = PERFIS_VALIDOS[tipoNormalizado]

    if (!perfil) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: `Perfil inválido: ${tipoNormalizado}`,
        },
        { status: 400 }
      )
    }

    // =========================
    // NORMALIZAR DADOS
    // =========================

    const nomeNormalizado = normalizarTexto(String(nome))
    const telefoneNormalizado = normalizarTelefone(String(telefone))
    const localizacaoNormalizada = normalizarTexto(String(localizacao))
    const senhaNormalizada = String(senha).trim()

    // =========================
    // VALIDAR NOME
    // =========================

    if (!nomeNormalizado) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe o seu nome.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR TELEFONE
    // =========================

    const telefoneValido = /^\+?[0-9]{9,13}$/.test(
      telefoneNormalizado
    )

    if (!telefoneValido) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe um número de telefone válido.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR PIN
    // =========================

    if (!/^\d{4}$/.test(senhaNormalizada)) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'O PIN deve conter exactamente 4 dígitos.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR LOCALIZAÇÃO
    // =========================

    if (!localizacaoNormalizada) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe a sua localização.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VERIFICAR TELEFONE EXISTENTE
    // =========================

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        telefone: telefoneNormalizado,
      },
      select: {
        id: true,
      },
    })

    if (usuarioExistente) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Já existe uma conta com este número de telefone.',
        },
        { status: 409 }
      )
    }

    // =========================
    // PROTEGER PIN COM BCRYPT
    // =========================

    const senhaHash = await bcrypt.hash(senhaNormalizada, 12)

    // =========================
    // CRIAR UTILIZADOR
    // =========================

    const usuario = await prisma.usuario.create({
      data: {
        nome: nomeNormalizado,
        telefone: telefoneNormalizado,
        localizacao: localizacaoNormalizada,
        senha: senhaHash,
        perfil,
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        localizacao: true,
        perfil: true,
        ativo: true,
        createdAt: true,
      },
    })

    // =========================
    // RESPOSTA
    // =========================

    return NextResponse.json(
      {
        sucesso: true,
        mensagem:
          perfil === Perfil.ENTREGADOR
            ? 'Conta de entregador criada com sucesso.'
            : 'Conta criada com sucesso.',
        usuario,
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('ERRO AO CRIAR CONTA:', error)

    if (error?.code === 'P2002') {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Já existe uma conta com estes dados.',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível criar a conta.',
      },
      { status: 500 }
    )
  }
}
