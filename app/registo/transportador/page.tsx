import EscolhaAcessoPerfil from "@/app/components/auth/EscolhaAcessoPerfil";


export default function RegistoTransportadorPage() {
  return (
    <EscolhaAcessoPerfil
      tipo="Transportador"
      perfil="transportador"
      descricao="Transporte produtos e grandes volumes entre produtores, fornecedores e clientes."
    />
  )
}

