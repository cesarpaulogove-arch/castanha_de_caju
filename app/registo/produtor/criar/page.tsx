import FormularioRegisto from "@/app/components/auth/FormularioRegisto";

export default function CriarProdutorPage() {
  return (
    <FormularioRegisto
      tipo="Produtor"
      perfil="produtor"
      descricao="Crie a sua conta para produzir e vender castanhas e outros produtos na plataforma."
    />
  );
}