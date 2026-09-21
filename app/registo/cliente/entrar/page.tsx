import FormularioLogin from "@/app/components/auth/FormularioLogin";


export default function EntrarClientePage() {
  return (
    <FormularioLogin
      tipo="Cliente"
      perfil="cliente"
      descricao="Entre na sua conta de cliente para continuar."
    />
  )
}

