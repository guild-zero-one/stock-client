import Header from "@/components/header";
import Input from "@/components/input";
import Button from "@/components/button";

import Person from "@mui/icons-material/Person";

export default function AdicionarCliente() {
  return (
    <div className="relative flex flex-col bg-white-default w-full min-h-screen">
      <Header title="Cliente" subtitle="Adicionar" />

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
          <Input label="Nome" name="Nome" inputSize="small" />
          <Input label="Sobrenome" name="Sobrenome" inputSize="small" />
        </div>
        <Input label="Telefone" name="Telefone" inputSize="small" />
        <Input label="E-mail" name="E-mail" inputSize="small" />
        <Input label="CPF" name="CPF" inputSize="small" />
        <Button label="Adicionar" variant="outlined" fullWidth />
      </div>
    </div>
  );
}
