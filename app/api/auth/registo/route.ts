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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      tipo,
      nome,
      telefone,
      email,
      localizacao,
      senha,
    } = body

    // =========================
    // VALIDAÇÃO DOS CAMPOS
    // =========================

    if (
      !tipo ||
      !nome ||
      !telefone ||
      !email ||
      !localizacao ||
      !senha
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Preencha todos os campos obrigatórios.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR PALAVRA-PASSE
    // =========================

    if (typeof senha !== 'string' || senha.length < 6) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            'A palavra-passe deve ter pelo menos 6 caracteres.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR PERFIL
    // =========================

    const perfil = PERFIS_VALIDOS[tipo]

    if (!perfil) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Perfil inválido.',
        },
        { status: 400 }
      )
    }

    // =========================
    // NORMALIZAR DADOS
    // =========================

    const nomeNormalizado = String(nome).trim()
    const telefoneNormalizado = String(telefone).trim()
    const emailNormalizado = String(email).trim().toLowerCase()
    const localizacaoNormalizada = String(localizacao).trim()

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

    if (!telefoneNormalizado) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe o seu telefone.',
        },
        { status: 400 }
      )
    }

    // =========================
    // VALIDAR EMAIL
    // =========================

    if (!emailNormalizado) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Informe o seu email.',
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
    // VERIFICAR SE EMAIL JÁ EXISTE
    // =========================

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: emailNormalizado,
      },
    })

    if (usuarioExistente) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: 'Já existe uma conta com este email.',
        },
        { status: 409 }
      )
    }

    // =========================
    // CRIPTOGRAFAR SENHA
    // =========================

    const senhaHash = await bcrypt.hash(senha, 12)

    // =========================
    // CRIAR UTILIZADOR
    // =========================

    const usuario = await prisma.usuario.create({
      data: {
        nome: nomeNormalizado,
        telefone: telefoneNormalizado,
        email: emailNormalizado,
        localizacao: localizacaoNormalizada,
        senha: senhaHash,
        perfil,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        email: true,
        localizacao: true,
        perfil: true,
        ativo: true,
        createdAt: true,
      },
    })

    // =========================
    // RESPOSTA DE SUCESSO
    // =========================

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: 'Conta criada com sucesso.',
        usuario,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('ERRO AO CRIAR CONTA:', error)

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: 'Não foi possível criar a conta.',
      },
      { status: 500 }
    )
  }
}