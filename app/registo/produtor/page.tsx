import EscolhaAcessoPerfil from "@/app/components/auth/EscolhaAcessoPerfil";


export default function RegistoProdutorPage() {
  return (
    <EscolhaAcessoPerfil
      tipo="Produtor"
      perfil="produtor"
      descricao="Produza e venda castanhas e outros produtos na plataforma."
    />
  )
}