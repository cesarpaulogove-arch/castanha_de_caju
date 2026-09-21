import FormularioLogin from "@/app/components/auth/FormularioLogin";


export default function EntrarFornecedorPage() {
  return (
    <FormularioLogin
      tipo="Fornecedor"
      perfil="fornecedor"
      descricao="Entre na sua conta de fornecedor para continuar."
    />
  )
}

