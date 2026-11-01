import FormularioRegisto from "@/app/components/auth/FormularioRegisto";

export default function CriarProcessadorPage() {
  return (
    <FormularioRegisto
      tipo="Processador"
      perfil="processador"
      descricao="Crie a sua conta para transformar castanhas em produtos processados e comercializáveis."
    />
  );
}