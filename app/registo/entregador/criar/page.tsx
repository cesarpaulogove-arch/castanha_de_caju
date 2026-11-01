import FormularioRegisto from "@/app/components/auth/FormularioRegisto";

export default function CriarEntregadorPage() {
  return (
    <FormularioRegisto
      tipo="Entregador"
      perfil="entregador"
      descricao="Crie a sua conta para trabalhar como entregador na plataforma."
    />
  );
}