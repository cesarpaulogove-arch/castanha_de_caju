import EscolhaAcessoPerfil from "@/app/components/auth/EscolhaAcessoPerfil";



export default function RegistoClientePage() {
  return (
    <EscolhaAcessoPerfil
      tipo="Cliente"
      perfil="cliente"
      descricao="Compre castanhas, produtos derivados e outros produtos disponíveis na plataforma."
    />
  )
}

