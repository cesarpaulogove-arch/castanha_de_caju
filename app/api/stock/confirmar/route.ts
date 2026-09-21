
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'
import {
  SESSION_COOKIE,
  gerarHashToken,
} from '@/lib/auth-session'

import {
  Perfil,
  TipoSessao,
  EstadoOperacao,
  TipoMovimentoStock,
} from '@/generated/prisma/enums'

export async function POST(request: Request) {
  try {
    // =========================================================
    // 1. VALIDAR GESTOR
    // =========================================================

    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.json(
        { erro: 'Não autenticado.' },
        { status: 401 }
      )
    }

    const tokenHash = gerarHashToken(token)

    const sessao = await prisma.sessao.findUnique({
      where: {
        tokenHash,
      },
    })

    if (!sessao) {
      return NextResponse.json(
        { erro: 'Sessão inválida.' },
        { status: 401 }
      )
    }

    if (sessao.expiraEm <= new Date()) {
      return NextResponse.json(
        { erro: 'Sessão expirada.' },
        { status: 401 }
      )
    }

    if (sessao.tipo !== TipoSessao.GESTOR) {
      return NextResponse.json(
        { erro: 'Apenas o gestor pode confirmar operações.' },
        { status: 403 }
      )
    }

    // =========================================================
    // 2. RECEBER DADOS
    // =========================================================

    const body = await request.json()

    const tipo = String(body.tipo ?? '')
    const operacaoId = Number(body.operacaoId)

    if (!operacaoId || !tipo) {
      return NextResponse.json(
        {
          erro: 'Tipo de operação e ID são obrigatórios.',
        },
        { status: 400 }
      )
    }

    const tiposValidos = [
      'PRODUCAO',
      'FORNECIMENTO',
      'PROCESSAMENTO',
    ]

    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        {
          erro: 'Tipo de operação inválido.',
        },
        { status: 400 }
      )
    }

    // =========================================================
    // 3. CONFIRMAR PRODUÇÃO
    // =========================================================

    if (tipo === 'PRODUCAO') {
      const resultado = await prisma.$transaction(async (tx) => {
        const producao = await tx.producao.findUnique({
          where: {
            id: operacaoId,
          },
          include: {
            produtor: true,
            produto: true,
          },
        })

        if (!producao) {
          throw new Error('PRODUCAO_NAO_ENCONTRADA')
        }

        if (producao.estado !== EstadoOperacao.PENDENTE) {
          throw new Error('OPERACAO_JA_PROCESSADA')
        }

        const quantidade = Number(
          producao.quantidade
        )

        if (quantidade <= 0) {
          throw new Error('QUANTIDADE_INVALIDA')
        }

        // -----------------------------------------------------
        // Alterar estado da produção
        // -----------------------------------------------------

        const actualizada = await tx.producao.updateMany({
          where: {
            id: operacaoId,
            estado: EstadoOperacao.PENDENTE,
          },
          data: {
            estado: EstadoOperacao.CONFIRMADO,
            confirmadoEm: new Date(),
          },
        })

        if (actualizada.count !== 1) {
          throw new Error('OPERACAO_JA_PROCESSADA')
        }

        // -----------------------------------------------------
        // Procurar ou criar stock do produto
        // -----------------------------------------------------

        const stockExistente =
          await tx.stock.findUnique({
            where: {
              produtoId: producao.produtoId,
            },
          })

        const quantidadeAntes = stockExistente
          ? Number(stockExistente.quantidade)
          : 0

        const quantidadeDepois =
          quantidadeAntes + quantidade

        let stock

        if (stockExistente) {
          stock = await tx.stock.update({
            where: {
              produtoId: producao.produtoId,
            },
            data: {
              quantidade: quantidadeDepois,
            },
          })
        } else {
          stock = await tx.stock.create({
            data: {
              produtoId: producao.produtoId,
              quantidade: quantidadeDepois,
            },
          })
        }

        // -----------------------------------------------------
        // Registar movimento
        // -----------------------------------------------------

        await tx.movimentoStock.create({
          data: {
            produtoId: producao.produtoId,

            quantidade: quantidade,

            quantidadeAntes,
            quantidadeDepois,

            tipo: TipoMovimentoStock.ENTRADA_PRODUCAO,

            producaoId: producao.id,

            gestorEmail:
              process.env.GESTOR_EMAIL ??
              null,

            descricao:
              `Entrada de ${quantidade.toFixed(
                3
              )} kg através da produção ${producao.lote}, registada pelo produtor ${producao.produtor.nome}.`,
          },
        })

        return {
          stock,
          produto: producao.produto.nome,
          lote: producao.lote,
          quantidade,
          origem: producao.produtor.nome,
        }
      })

      return NextResponse.json({
        sucesso: true,
        mensagem: 'Produção confirmada e stock actualizado.',
        dados: resultado,
      })
    }

    // =========================================================
    // 4. CONFIRMAR FORNECIMENTO
    // =========================================================

    if (tipo === 'FORNECIMENTO') {
      const resultado = await prisma.$transaction(
        async (tx) => {
          const fornecimento =
            await tx.fornecimento.findUnique({
              where: {
                id: operacaoId,
              },
              include: {
                fornecedor: true,
                produto: true,
              },
            })

          if (!fornecimento) {
            throw new Error('FORNECIMENTO_NAO_ENCONTRADO')
          }

          if (
            fornecimento.estado !==
            EstadoOperacao.PENDENTE
          ) {
            throw new Error('OPERACAO_JA_PROCESSADA')
          }

          const quantidade = Number(
            fornecimento.quantidade
          )

          if (quantidade <= 0) {
            throw new Error('QUANTIDADE_INVALIDA')
          }

          // ---------------------------------------------------
          // Alterar estado
          // ---------------------------------------------------

          const actualizada =
            await tx.fornecimento.updateMany({
              where: {
                id: operacaoId,
                estado: EstadoOperacao.PENDENTE,
              },
              data: {
                estado:
                  EstadoOperacao.CONFIRMADO,
                confirmadoEm: new Date(),
              },
            })

          if (actualizada.count !== 1) {
            throw new Error('OPERACAO_JA_PROCESSADA')
          }

          // ---------------------------------------------------
          // Actualizar stock
          // ---------------------------------------------------

          const stockExistente =
            await tx.stock.findUnique({
              where: {
                produtoId:
                  fornecimento.produtoId,
              },
            })

          const quantidadeAntes =
            stockExistente
              ? Number(stockExistente.quantidade)
              : 0

          const quantidadeDepois =
            quantidadeAntes + quantidade

          let stock

          if (stockExistente) {
            stock = await tx.stock.update({
              where: {
                produtoId:
                  fornecimento.produtoId,
              },
              data: {
                quantidade: quantidadeDepois,
              },
            })
          } else {
            stock = await tx.stock.create({
              data: {
                produtoId:
                  fornecimento.produtoId,
                quantidade:
                  quantidadeDepois,
              },
            })
          }

          // ---------------------------------------------------
          // Histórico
          // ---------------------------------------------------

          await tx.movimentoStock.create({
            data: {
              produtoId:
                fornecimento.produtoId,

              quantidade,

              quantidadeAntes,
              quantidadeDepois,

              tipo:
                TipoMovimentoStock.ENTRADA_FORNECIMENTO,

              fornecimentoId:
                fornecimento.id,

              gestorEmail:
                process.env.GESTOR_EMAIL ??
                null,

              descricao:
                `Entrada de ${quantidade.toFixed(
                  3
                )} kg através do fornecimento ${fornecimento.lote}, registado pelo fornecedor ${fornecimento.fornecedor.nome}.`,
            },
          })

          return {
            stock,
            produto:
              fornecimento.produto.nome,
            lote: fornecimento.lote,
            quantidade,
            origem:
              fornecimento.fornecedor.nome,
          }
        }
      )

      return NextResponse.json({
        sucesso: true,
        mensagem:
          'Fornecimento confirmado e stock actualizado.',
        dados: resultado,
      })
    }

    // =========================================================
    // 5. CONFIRMAR PROCESSAMENTO
    // =========================================================

    if (tipo === 'PROCESSAMENTO') {
      const resultado = await prisma.$transaction(
        async (tx) => {
          const processamento =
            await tx.processamento.findUnique({
              where: {
                id: operacaoId,
              },
              include: {
                processador: true,
                produto: true,
              },
            })

          if (!processamento) {
            throw new Error(
              'PROCESSAMENTO_NAO_ENCONTRADO'
            )
          }

          if (
            processamento.estado !==
            EstadoOperacao.PENDENTE
          ) {
            throw new Error(
              'OPERACAO_JA_PROCESSADA'
            )
          }

          const quantidade = Number(
            processamento.quantidade
          )

          if (quantidade <= 0) {
            throw new Error('QUANTIDADE_INVALIDA')
          }

          // ---------------------------------------------------
          // Alterar estado
          // ---------------------------------------------------

          const actualizada =
            await tx.processamento.updateMany({
              where: {
                id: operacaoId,
                estado: EstadoOperacao.PENDENTE,
              },
              data: {
                estado:
                  EstadoOperacao.CONFIRMADO,
                confirmadoEm: new Date(),
              },
            })

          if (actualizada.count !== 1) {
            throw new Error(
              'OPERACAO_JA_PROCESSADA'
            )
          }

          // ---------------------------------------------------
          // Actualizar stock
          // ---------------------------------------------------

          const stockExistente =
            await tx.stock.findUnique({
              where: {
                produtoId:
                  processamento.produtoId,
              },
            })

          const quantidadeAntes =
            stockExistente
              ? Number(stockExistente.quantidade)
              : 0

          const quantidadeDepois =
            quantidadeAntes + quantidade

          let stock

          if (stockExistente) {
            stock = await tx.stock.update({
              where: {
                produtoId:
                  processamento.produtoId,
              },
              data: {
                quantidade: quantidadeDepois,
              },
            })
          } else {
            stock = await tx.stock.create({
              data: {
                produtoId:
                  processamento.produtoId,
                quantidade:
                  quantidadeDepois,
              },
            })
          }

          // ---------------------------------------------------
          // Histórico
          // ---------------------------------------------------

          await tx.movimentoStock.create({
            data: {
              produtoId:
                processamento.produtoId,

              quantidade,

              quantidadeAntes,
              quantidadeDepois,

              tipo:
                TipoMovimentoStock.ENTRADA_PROCESSAMENTO,

              processamentoId:
                processamento.id,

              gestorEmail:
                process.env.GESTOR_EMAIL ??
                null,

              descricao:
                `Entrada de ${quantidade.toFixed(
                  3
                )} kg através do processamento ${processamento.lote}, realizado pelo processador ${processamento.processador.nome}.`,
            },
          })

          return {
            stock,
            produto:
              processamento.produto.nome,
            lote: processamento.lote,
            quantidade,
            origem:
              processamento.processador.nome,
          }
        }
      )

      return NextResponse.json({
        sucesso: true,
        mensagem:
          'Processamento confirmado e stock actualizado.',
        dados: resultado,
      })
    }

    return NextResponse.json(
      {
        erro: 'Operação não suportada.',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error(
      'ERRO_CONFIRMAR_STOCK:',
      error
    )

    const mensagem =
      error instanceof Error
        ? error.message
        : ''

    if (
      mensagem ===
      'OPERACAO_JA_PROCESSADA'
    ) {
      return NextResponse.json(
        {
          erro:
            'Esta operação já foi processada anteriormente.',
        },
        { status: 409 }
      )
    }

    if (
      mensagem ===
      'PRODUCAO_NAO_ENCONTRADA'
    ) {
      return NextResponse.json(
        {
          erro: 'Produção não encontrada.',
        },
        { status: 404 }
      )
    }

    if (
      mensagem ===
      'FORNECIMENTO_NAO_ENCONTRADO'
    ) {
      return NextResponse.json(
        {
          erro: 'Fornecimento não encontrado.',
        },
        { status: 404 }
      )
    }

    if (
      mensagem ===
      'PROCESSAMENTO_NAO_ENCONTRADO'
    ) {
      return NextResponse.json(
        {
          erro: 'Processamento não encontrado.',
        },
        { status: 404 }
      )
    }

    if (
      mensagem ===
      'QUANTIDADE_INVALIDA'
    ) {
      return NextResponse.json(
        {
          erro:
            'A quantidade da operação deve ser superior a zero.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        erro:
          'Não foi possível actualizar o stock.',
      },
      { status: 500 }
    )
  }
}

