'use client'
import Input from "@/components/input";
import FaceIcon from '@mui/icons-material/Face';
import React from "react";

export default function ComponentTest() {

const [nome, setNome] = React.useState<string>("");

const handleChangeNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);

}

    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Página de Teste</h1>
        <Input type="text" name="nome" label="Nome"inputSize="default" showIcon={true} iconSymbol={<FaceIcon />}
        />
      </main>
    );
  }