'use client'
import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import ImageIcon from '@mui/icons-material/Image';

export default function CriarMarca() {
    return (
        <main className="relative flex flex-col w-full min-h-screen">
            <Header title="Adicionar" subtitle="Marca" />

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <div className="flex justify-between">
                    <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl">
                        <ImageIcon fontSize="inherit" />
                    </div>

                    <ButtonFile onSelect={(file) => console.log(file)} label="Adicionar Imagem" accept="image/*" />
                </div>
                {/* Inputs */}
                <div className="flex flex-col gap-2">
                    <Input label="Nome" name="marca-name" />
                    <Input label="Descrição" name="marca-description" />
                    <Input label="CNPJ" name="marca-cnpj" />
                </div>

                {/* Button */}

                <Button label={"Adicionar Marca"} fullWidth />


            </div>

        </main>
    )
}