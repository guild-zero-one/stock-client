import Header from "@/components/header";
import Input from "@/components/input";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useEffect, useState } from "react";

export default function Estoque() {

    return (
        <div className="relative flex flex-col bg-(--white-default) w-full min-h-screen">
            <Header
                title="Estoque"
                subtitle="Categorias"
                addRightButton={true}
                rightIcon={<AddCircleIcon />}
            />

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <Input
                    name="search"
                    label="Pesquisar"
                    type="text"
                    showIcon={true}
                    iconSymbol={<SearchIcon />}
                    inputSize="small"
                />
            </div>

            <div className="bottom-0 absolute flex flex-col bg-(--pink-secondary) p-4 pb-0 rounded-t-2xl w-full h-[80%] max-h-[85%]">
                <div className="flex flex-col justify-center items-center my-1 w-full">
                    <span className="font-[nunito] font-bold text-(--black) text-sm">Categorias</span>
                </div>
                <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto scrollbar-minimal">
                    {Array(20).fill(0).map((_, i) => (
                        <div 
                            key={i} 
                            className="flex-shrink-0 bg-white shadow-md rounded-2xl w-full h-[30vh] min-h-[160px] max-h-[300px]"
                        ></div>
                    ))}
                    
                </div>
            </div>

        </div>
    );
}