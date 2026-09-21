import EscolhaAcessoPerfil from "@/app/components/auth/EscolhaAcessoPerfil";


export default function RegistoFornecedorPage() {
  return (
    <EscolhaAcessoPerfil
      tipo="Fornecedor"
      perfil="fornecedor"
      descricao="Forneça produtos, materiais e recursos para os participantes da plataforma."
    />
  )
}

