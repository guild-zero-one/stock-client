import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";

import Person from "@mui/icons-material/Person";

export default function DetalheCliente() {
  const cliente = {
    id: 1,
    nome: "Jeferson",
    sobrenome: "Silva",
    contato: "987654321",
    email: "jeferson@gmail.com",
    cpf: "",
    dataCriacao: "2023-10-01",
  };

  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      <Header title="Cliente" subtitle="Detalhes" />

      {/* Adicionar Imagem */}
      <div className="flex justify-between gap-4 p-4 w-full">
        <div className="flex items-center bg-pink-default p-4 rounded-lg">
          <Person fontSize="large" className="text-white" />
        </div>

        <div className="flex items-center flex-col gap-2">
          <Button label="Adicionar Imagem" />
          <p className="text-xs text-text-secondary">
            Nenhuma imagem selecionada
          </p>
        </div>
      </div>

      {/* Adicionar Cliente */}
      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="flex gap-2">
          <Input
            label="Nome"
            name="Nome"
            inputSize="small"
            value={cliente.nome}
          />
          <Input
            label="Sobrenome"
            name="Sobrenome"
            inputSize="small"
            value={cliente.sobrenome}
          />
        </div>
        <Input
          label="Telefone"
          name="Telefone"
          inputSize="small"
          value={cliente.contato}
        />
        <Input
          label="E-mail"
          name="E-mail"
          inputSize="small"
          value={cliente.email}
        />
        <Input label="CPF" name="CPF" inputSize="small" value={cliente.cpf} />
        <Button label="Excluir" variant="outlined" fullWidth />
        <Button label="Editar" fullWidth />
      </div>
    </div>
  );
}
