'use client'

import {
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react'

interface EntregadorSorteado {
  nome: string
  foto?: string
}

interface FormularioEntregaProps {
  formularioAberto: boolean
  sucesso: boolean

  nome: string
  distrito: string
  bairro: string
  telefone: string

  setNome: (valor: string) => void
  setDistrito: (valor: string) => void
  setBairro: (valor: string) => void
  setTelefone: (valor: string) => void

  clienteEncontrado: boolean
  clienteConsultado: boolean
  aProcurarCliente: boolean

  procurarCliente: (telefone?: string) => Promise<void> | void

  gerirSubmissao: (
    evento: React.FormEvent<HTMLFormElement>
  ) => Promise<void>

  fecharFormulario: () => void
  finalizarSucesso: () => void

  estaAProcessar: boolean

  entregadorSorteado: EntregadorSorteado | null
}

const bairrosPorDistrito: Record<string, string[]> = {
  KaMpfumo: [
    'Central A',
    'Central B',
    'Central C',
    'Alto Maé',
    'Malhangalene',
    'Polana',
    'Sommerschield',
  ],

  Nhlamankulu: [
    'Aeroporto',
    'Chamanculo A',
    'Chamanculo B',
    'Chamanculo C',
    'Chamanculo D',
    'Minkadjuíne',
    'Munhuana',
    'Xipamanine',
  ],

  KaMaxakeni: [
    'Mafalala',
    'Maxaquene A',
    'Maxaquene B',
    'Maxaquene C',
    'Maxaquene D',
    'Urbanização',
  ],

  KaMavota: [
    '3 de Fevereiro',
    'Albazine',
    'Costa do Sol',
    'Ferroviário',
    'FPLM',
    'Hulene A',
    'Hulene B',
    'Mavalane A',
    'Mavalane B',
  ],

  KaMubukwana: [
    '25 de Junho A',
    '25 de Junho B',
    'Bagamoyo',
    'George Dimitrov',
    'Inhagoia A',
    'Inhagoia B',
    'Jardim',
    'Luis Cabral',
    'Magoanine A',
    'Magoanine B',
    'Magoanine C',
    'Malhazine',
    'Zimpeto',
  ],

  KaTembe: [
    'Chamissava',
    'Inguide',
    'Inguane',
    'Ponta do Ouro',
    'Tembe',
  ],

  KaNyaka: [
    'Inhaca',
    'Nhaúnda',
  ],

  'Matola-Sede': [
    'Matola A',
    'Matola B',
    'Matola C',
    'Matola D',
    'Matola F',
    'Matola G',
    'Matola H',
  ],

  Machava: [
    'Machava Sede',
    'Machava Socimol',
    'Machava Km 15',
    'Machava Bunhiça',
  ],

  Infulene: [
    'Infulene',
    'Tsalala',
    'Liberdade',
    'Fomento',
  ],

  Boane: [
    'Boane Sede',
    'Matola-Rio',
    'Eduardo Mondlane',
  ],

  Marracuene: [
    'Marracuene Sede',
    'Michafutene',
    'Marracuene',
  ],
}

export default function FormularioEntrega({
  formularioAberto,
  sucesso,

  nome,
  distrito,
  bairro,
  telefone,

  setNome,
  setDistrito,
  setBairro,
  setTelefone,

  clienteEncontrado,
  clienteConsultado,
  aProcurarCliente,

  procurarCliente,

  gerirSubmissao,

  fecharFormulario,
  finalizarSucesso,

  estaAProcessar,

  entregadorSorteado,
}: FormularioEntregaProps) {
  if (!formularioAberto) {
    return null
  }

  /*
   * ---------------------------------------------------------
   * TELA DE SUCESSO
   * ---------------------------------------------------------
   */

  if (sucesso) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle
              size={48}
              className="text-emerald-600"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Pedido realizado!
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            O seu pedido foi registado com sucesso.
            A nossa equipa irá tratar da entrega.
          </p>

          {entregadorSorteado && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Entregador atribuído
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {entregadorSorteado.nome}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={finalizarSucesso}
            className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700"
          >
            Concluir
          </button>
        </div>
      </div>
    )
  }

  /*
   * ---------------------------------------------------------
   * MODAL PRINCIPAL
   * ---------------------------------------------------------
   */

  const numeroValido =
    telefone.replace(/\D/g, '').length === 9

  const mostrarCamposNovoCliente =
    clienteConsultado &&
    !aProcurarCliente &&
    !clienteEncontrado

  const mostrarClienteRegistado =
    clienteConsultado &&
    !aProcurarCliente &&
    clienteEncontrado

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 p-4">
      <div className="flex min-h-full items-center justify-center py-6">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between bg-slate-950 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Finalizar Pedido
              </h2>

              <p className="text-xs text-slate-300">
                Primeiro confirme o seu WhatsApp
              </p>
            </div>

            <button
              type="button"
              onClick={fecharFormulario}
              disabled={estaAProcessar}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={gerirSubmissao}
            className="p-5 sm:p-6"
          >
            {/* =================================================
                PRIMEIRA ETAPA:
                SOMENTE TELEFONE
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label
                htmlFor="telefone"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <Phone size={17} />
                WhatsApp / Telefone
              </label>

              <div className="relative">
                <input
                  id="telefone"
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={telefone}
                  onChange={(evento) => {
                    const apenasNumeros =
                      evento.target.value
                        .replace(/\D/g, '')
                        .slice(0, 9)

                    setTelefone(apenasNumeros)
                  }}
                  placeholder="Ex.: 847059112"
                  disabled={estaAProcessar}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                />

                {aProcurarCliente && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2
                      size={21}
                      className="animate-spin text-emerald-600"
                    />
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Digite os 9 dígitos do seu número.
                </p>

                <span className="text-xs font-semibold text-slate-400">
                  {telefone.length}/9
                </span>
              </div>

              {/* BOTÃO MANUAL DE VERIFICAÇÃO */}

              {numeroValido &&
                !clienteConsultado &&
                !aProcurarCliente && (
                  <button
                    type="button"
                    onClick={() =>
                      procurarCliente(telefone)
                    }
                    disabled={estaAProcessar}
                    className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    Verificar número
                  </button>
                )}
            </div>

            {/* =================================================
                CLIENTE REGISTADO
            ================================================= */}

            {mostrarClienteRegistado && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle
                        size={22}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-emerald-800">
                        Cliente registado
                      </h3>

                      <p className="mt-1 text-sm text-emerald-700">
                        Encontrámos os seus dados. Pode
                        avançar diretamente para finalizar
                        o pedido.
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESUMO DO CLIENTE */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <div>
                        <p className="text-xs text-slate-500">
                          Nome
                        </p>

                        <p className="font-semibold text-slate-900">
                          {nome || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <div>
                        <p className="text-xs text-slate-500">
                          Localização
                        </p>

                        <p className="font-semibold text-slate-900">
                          {distrito || '—'}
                          {bairro
                            ? ` — ${bairro}`
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        size={18}
                        className="mt-0.5 shrink-0 text-slate-500"
                      />

                      <div>
                        <p className="text-xs text-slate-500">
                          WhatsApp
                        </p>

                        <p className="font-semibold text-slate-900">
                          {telefone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FINALIZAR */}

                <button
                  type="submit"
                  disabled={estaAProcessar}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {estaAProcessar ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      A processar pedido...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Finalizar Pedido
                    </>
                  )}
                </button>
              </div>
            )}

            {/* =================================================
                CLIENTE NOVO
            ================================================= */}

            {mostrarCamposNovoCliente && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <User
                        size={21}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-800">
                        Novo cliente
                      </h3>

                      <p className="mt-1 text-sm text-blue-700">
                        Este número ainda não está registado.
                        Preencha os dados abaixo para
                        continuar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* NOME */}

                <div>
                  <label
                    htmlFor="nome"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Nome completo
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(evento) =>
                        setNome(evento.target.value)
                      }
                      placeholder="Digite o seu nome"
                      disabled={estaAProcessar}
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {/* DISTRITO */}

                <div>
                  <label
                    htmlFor="distrito"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Distrito
                  </label>

                  <select
                    id="distrito"
                    value={distrito}
                    onChange={(evento) => {
                      setDistrito(evento.target.value)
                      setBairro('')
                    }}
                    disabled={estaAProcessar}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">
                      Selecione o distrito
                    </option>

                    {Object.keys(
                      bairrosPorDistrito
                    ).map((nomeDistrito) => (
                      <option
                        key={nomeDistrito}
                        value={nomeDistrito}
                      >
                        {nomeDistrito}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BAIRRO */}

                <div>
                  <label
                    htmlFor="bairro"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Bairro
                  </label>

                  <select
                    id="bairro"
                    value={bairro}
                    onChange={(evento) =>
                      setBairro(evento.target.value)
                    }
                    disabled={
                      estaAProcessar || !distrito
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      {distrito
                        ? 'Selecione o bairro'
                        : 'Primeiro selecione o distrito'}
                    </option>

                    {distrito &&
                      bairrosPorDistrito[
                        distrito
                      ]?.map((nomeBairro) => (
                        <option
                          key={nomeBairro}
                          value={nomeBairro}
                        >
                          {nomeBairro}
                        </option>
                      ))}
                  </select>
                </div>

                {/* FINALIZAR */}

                <button
                  type="submit"
                  disabled={estaAProcessar}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {estaAProcessar ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      A processar pedido...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Finalizar Pedido
                    </>
                  )}
                </button>
              </div>
            )}

            {/* =================================================
                AVISO ENQUANTO CONSULTA
            ================================================= */}

            {aProcurarCliente && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <Loader2
                  size={18}
                  className="animate-spin text-emerald-600"
                />

                A verificar os seus dados...
              </div>
            )}

            {/* =================================================
                CANCELAR
            ================================================= */}

            <button
              type="button"
              onClick={fecharFormulario}
              disabled={estaAProcessar}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}