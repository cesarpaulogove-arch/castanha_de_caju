import FormularioRegisto from "@/app/components/auth/FormularioRegisto";

export default function CriarTransportadorPage() {
  return (
    <FormularioRegisto
      tipo="Transportador"
      perfil="transportador"
      descricao="Crie a sua conta para transportar produtos e grandes volumes na plataforma."
    />
  );
}