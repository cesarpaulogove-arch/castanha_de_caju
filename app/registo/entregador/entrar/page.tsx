import FormularioLogin from "@/app/components/auth/FormularioLogin";


export default function EntrarEntregadorPage() {
  return (
    <FormularioLogin
      tipo="Entregador"
      perfil="entregador"
      descricao="Entre na sua conta de entregador para continuar."
    />
  )
}

