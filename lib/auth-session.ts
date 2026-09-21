import { createHash, randomBytes } from 'crypto'

export const SESSION_COOKIE = 'sessao_usuario'

export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export function criarTokenSessao() {
  return randomBytes(32).toString('hex')
}

export function gerarHashToken(token: string) {
  return createHash('sha256')
    .update(token)
    .digest('hex')
}

export function dataExpiracaoSessao() {
  return new Date(Date.now() + SESSION_DURATION)
}