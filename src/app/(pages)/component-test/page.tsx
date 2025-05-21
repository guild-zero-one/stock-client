'use client'
import Button from "@/components/button";
import FaceIcon from '@mui/icons-material/Face';
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import AddCircle from '@mui/icons-material/AddCircle';
import Input from "@/components/input";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import { todasMarcas } from "@/api/spring/services/FornecedorService";
import DropdownAdd from "@/components/dropdown/dropdown-add";
import DropdownItem from "@/components/dropdown/dropdown-item";
import Link from "next/link";
import Modal from "@/components/modal-popup";

export default function ComponentTest() {

  const [categories, setCategories] = useState<Fornecedor[]>([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fecthData = async () => {
      const marcas = await todasMarcas()
      if (marcas) {
        setCategories(marcas)
      }

    }
    fecthData();
  }, []);

  const handleOpen = () => setModal(true);
  const handleClose = () => setModal(false);
  return (
    <>
      <main className="bg-white-default p-4 w-[100%] h-dvh">
        <h1 className="mb-4 w-auto font-lexend font-bold text-4xl">Componentes</h1>

        <div className="justify-items-center gap-4 grid grid-cols-4">
          {/* Card */}
          <div className="flex flex-col gap-8 col-span-4 bg-white p-4 border border-gray-default rounded-lg w-[100%]">

            <div className="relative w-full">
              <h2 className="text-text-secondary">Header Componente</h2>

              <Header title="Produtos" subtitle="Navegar">

                <DropdownAdd>

                  <Link href={"#"}>
                    <DropdownItem text="Adicionar Marca" icon={<AddCircle />} />
                  </Link>

                  <Link href={"#"}>
                    <DropdownItem text="Adicionar Produto" icon={<AddCircle />} />
                  </Link>

                </DropdownAdd>

              </Header>


            </div>

            {/* Input*/}
            <div className="">
              <h2 className="text-text-secondary">Input Componente</h2>
              <Input type="text"
                name="nome"
                label="Nome"
                size="small" iconSymbol={<FaceIcon />} />
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

        <Button
          label={"Abrir Modal"}
          size="default"
          variant="filled"
          onClick={handleOpen}
        />

        <Modal open={modal}
          onClose={() => handleClose()}
          icon={<AssignmentTurnedInIcon />}
          title={
            <>
              Titulo
            </>
          }
          body={
            <>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, natus eligendi saepe delectus blanditiis nam ea ad quibusdam alias totam. At veritatis soluta voluptate alias porro pariatur magnam laborum a.
              </p>
            </>
          }
          footer={
            <>
              <Button label="Seguir" fullWidth />
              <Button label="Cancelar" fullWidth variant="outlined" />
            </>
          }
        />
      </main>

    </>

  );
}

