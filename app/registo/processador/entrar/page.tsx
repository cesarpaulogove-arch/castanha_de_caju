import FormularioLogin from "@/app/components/auth/FormularioLogin";

export default function EntrarProcessadorPage() {
  return (
    <FormularioLogin
      tipo="Processador"
      perfil="processador"
      descricao="Entre na sua conta de processador para continuar."
    />
  )
}

