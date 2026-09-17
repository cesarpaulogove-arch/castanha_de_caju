
'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormularioRegistoProps {
  tipo: string
  descricao: string
}

export default function FormularioRegisto({
  tipo,
  descricao,
}: FormularioRegistoProps) {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const submeterFormulario = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErro('')
    setSucesso(false)

    if (senha !== confirmarSenha) {
      setErro('As palavras-passe não coincidem.')
      return
    }

    if (senha.length < 6) {
      setErro('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }

    // Aqui será integrada a API/base de dados
    console.log({
      tipo,
      nome,
      telefone,
      email,
      localizacao,
      senha,
    })

    setSucesso(true)
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-4 py-6">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#166534]"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="rounded-3xl border border-[#e7d5b8] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#166534] text-white">
              <UserPlus size={30} />
            </div>

            <h1 className="text-2xl font-bold text-[#422006]">
              Registo de {tipo}
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {descricao}
            </p>
          </div>

          <form onSubmit={submeterFormulario} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Nome completo
              </label>

              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Digite o seu nome completo"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Número de telefone
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                placeholder="+258 84 000 0000"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="exemplo@email.com"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Localização
              </label>

              <input
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
                placeholder="Bairro, cidade ou distrito"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Palavra-passe
              </label>

              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#422006]">
                Confirmar palavra-passe
              </label>

              <input
                type="password"
                value={confirmarSenha}
                onChange={(event) =>
                  setConfirmarSenha(event.target.value)
                }
                placeholder="Repita a palavra-passe"
                required
                className="w-full rounded-xl border border-[#e7d5b8] px-4 py-3 outline-none focus:border-[#166534]"
              />
            </div>

            {erro && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {erro}
              </p>
            )}

            {sucesso && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                Formulário validado. A integração com a base de dados será feita posteriormente.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#166534] px-4 py-3 font-bold text-white transition hover:bg-[#14532d]"
            >
              Criar registo
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}