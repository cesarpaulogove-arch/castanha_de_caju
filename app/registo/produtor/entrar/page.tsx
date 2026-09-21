import FormularioLogin from "@/app/components/auth/FormularioLogin";


export default function EntrarProdutorPage() {
  return (
    <FormularioLogin
      tipo="Produtor"
      perfil="produtor"
      descricao="Entre na sua conta de produtor para continuar."
    />
  )
}

