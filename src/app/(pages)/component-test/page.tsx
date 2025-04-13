'use client'
import Input from "@/components/input";
import Button from "@/components/button";
import FaceIcon from '@mui/icons-material/Face';
import React from "react";
import Header from "@/components/header";
import AddCircle from '@mui/icons-material/AddCircle';

export default function ComponentTest() {

  const [nome, setNome] = React.useState<string>("");

  const handleChangeNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  }
   const alertar = () => {
    alert("Cliquei no botão!"); 
  }
  return (
    <main className="p-4 w-[100%] h-screen bg-(--white-default)">
      <h1 className="font-[lexend] text-5xl font-bold mb-4 ">Componentes</h1>

      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {/* Card */}
        <div className="col-span-4 bg-(--white) rounded-lg p-4 w-[100%] border border-(--gray-default) gap-8 flex flex-col">

          <div className="w-full">
            <h2 className="font-[nunito] text-(--text-secondary)">Header Componente</h2>
            <Header
            title="Produtos"
            subtitle="Navegar"
            addRightButton 
            rightIcon={<AddCircle/>}
            rightElementFunction={alertar}
            />
          </div>

          {/* Input*/}
          <div className="">
            <h2 className="font-[nunito] text-(--text-secondary)">Input Componente</h2>
            <Input type="text"
              name="nome"
              label="Nome"
              showIcon={true}
              inputSize="small" iconSymbol={<FaceIcon />} />
          </div>

          {/* Button */}
          <div className="w-full h-full">
            <h2 className="font-[nunito] text-(--text-secondary)">Botão Componente</h2>
            <div className="grid grid-cols-2 flex-wrap gap-2 items-center">
              <Button
                label={"Clique aqui"}
                size="small"
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
                variant="outlined"
              />

              <Button
                label={"Clique aqui"}
                size="default"
                variant="filled"
              />
            </div>
            <div className="w-full mt-3.5">
            <Button
              label={"Linha Completa"}
              size="default"
              variant="filled"
              fullWidth>
            </Button>
          </div>
          </div>


        </div>
      </div>
    </main>
  );
}