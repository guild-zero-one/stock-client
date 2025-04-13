'use client'
import Input from "@/components/input";
import { use } from "react";
import FaceIcon from '@mui/icons-material/Face';
import AddReactionIcon from '@mui/icons-material/AddReaction';

export default function Home() {
  return (
    <main>
      <header className="bg-gray-100 p-4 shadow-md w-full">
        <h1 className="text-2xl font-bold mb-4">Página Inicial</h1>
        <p className="text-gray-700">Bem-vindo à página inicial!</p>  
      </header>
      
      <div className="grid grid-cols-4 mx-4 items-center place-items-center align-middle justify-center mt-8">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-500 rounded-full"></div>
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-500 rounded-full"></div>
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500 rounded-full"></div>
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-yellow-500 rounded-full"></div>

        <div className="col-span-4 w-full mt-10">
          <Input
        type="text"
        name="nome"
        label="Nome"
        showIcon={true}
        iconSymbol={<AddReactionIcon />}
        inputStyle="default"
        inputSize="small"
          />
        </div>
      </div>
    </main>
  );
}
