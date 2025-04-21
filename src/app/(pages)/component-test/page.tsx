'use client'
import Button from "@/components/button";
import FaceIcon from '@mui/icons-material/Face';
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import AddCircle from '@mui/icons-material/AddCircle';
import Input from "@/components/input";
import CategoriesMenu from "@/components/categories-menu";
import apiSpring from "@/api/api-spring";
import { Category } from "@/models/Categoria";

export default function ComponentTest() {

  const alertar = () => {
    alert("Cliquei no botão!");
  }
  const [category, setCategory] = useState<Category>();
  const [categories, setCategories] = useState<Category[]>([]);




  useEffect(() => {
    apiSpring.get("/categories")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

  }, []);

  return (
    <>
      <main className="bg-white-default p-4 w-[100%] h-dvh">
        <h1 className="mb-4 w-auto font-lexend font-bold text-4xl">Componentes</h1>

        <div className="justify-items-center gap-4 grid grid-cols-4">
          {/* Card */}
          <div className="flex flex-col gap-8 col-span-4 bg-white p-4 border border-gray-default rounded-lg w-[100%]">

            <div className="w-full">
              <h2 className="font-[nunito] text-text-secondary">Header Componente</h2>
              <Header
                title="Produtos"
                subtitle="Navegar"
                addRightButton
                rightIcon={<AddCircle />}
                rightElementFunction={alertar}
              />
            </div>

            {/* Input*/}
            <div className="">
              <h2 className="text-text-secondary">Input Componente</h2>
              <Input type="text"
                name="nome"
                label="Nome"
                showIcon={true}
                inputSize="small" iconSymbol={<FaceIcon />} />
            </div>

            {/* Button */}
            <div className="w-full h-full">
              <h2 className="font-[nunito] text-(--text-secondary)">Botão Componente</h2>
              <div className="flex-wrap items-center gap-2 grid grid-cols-2">
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
              <div className="mt-3.5 w-full">
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

      <div className="gap-2 bg-pink-default p-4 border border-gray-dark rounded-t-3xl w-full h-[75vh]">
        <div className="flex flex-col flex-1 gap-3 h-full overflow-y-auto scrollbar-minimal">

          {categories.map((category) => (
            <CategoriesMenu
              key={category.id}
              name={category.name}
              image={category.image}
              description={category.description}
              quantity={category.quantity}

              onClick={() => {
                alert(`Você clicou na categoria ${category.name}`)
              }}
            />
          ))}

        </div>
      </div>
    </>

  );
}
