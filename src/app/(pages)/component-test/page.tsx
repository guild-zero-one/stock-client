'use client'
import Input from "@/components/input";
import Button from "@/components/button";
import FaceIcon from '@mui/icons-material/Face';
import React from "react";

export default function ComponentTest() {

  const [nome, setNome] = React.useState<string>("");

  const handleChangeNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  }

  return (
    <main className="p-4 w-[100%] h-screen bg-(--white-default)">
      <h1 className="font-[lexend] text-5xl font-bold mb-4 ">Componentes</h1>

      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {/* Card */}
        <div className="col-span-4 bg-(--white) rounded-lg p-4 w-[50%] border border-(--gray-default) gap-8 flex flex-col">

          <div className="">
            <h2 className="font-[nunito] text-(--text-secondary)">Input Componente</h2>
            <Input type="text"
              name="nome"
              label="Nome"
              showIcon={true}
              inputSize="small" iconSymbol={<FaceIcon />} />
          </div>

          <div className="">
            <h2 className="font-[nunito] text-(--text-secondary)">Botão Componente</h2>
            <div className="flex gap-4">
              <Button
                label={"Clique aqui"}
                size="small"
                variant="outlined"
              />
              <Button
                label={"Clique aqui"}
                size="default"
                variant="outlined"
              />
              <Button
                label={"Clique aqui"}
                size="small"
                variant="filled"
              />
              <Button
                label={"Clique aqui"}
                size="default"
                variant="filled"
              />
            </div>
          </div>
          <div className="w-full">
            <Button
              label={"Linha Completa"}
              size="default"
              variant="filled"
              fullWidth>
            </Button>
          </div>

        </div>
      </div>
    </main>
  );
}