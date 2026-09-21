import FormularioLogin from "@/app/components/auth/FormularioLogin";


export default function EntrarTransportadorPage() {
  return (
    <FormularioLogin
      tipo="Transportador"
      perfil="transportador"
      descricao="Entre na sua conta de transportador para continuar."
    />
  )
}

