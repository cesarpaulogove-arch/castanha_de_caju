import FormularioRegisto from "@/app/components/auth/FormularioRegisto";

export default function CriarFornecedorPage() {
  return (
    <FormularioRegisto
      tipo="Fornecedor"
      perfil="fornecedor"
      descricao="Crie a sua conta para fornecer produtos, materiais e recursos na plataforma."
    />
  );
}