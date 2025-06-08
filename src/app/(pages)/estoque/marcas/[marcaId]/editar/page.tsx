'use client'
import { marcaPorId } from "@/api/spring/services/FornecedorService";
import Button from "@/components/button";
import ButtonFile from "@/components/button-file";
import Header from "@/components/header";
import Input from "@/components/input";
import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import ImageIcon from '@mui/icons-material/Image';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CriarMarca() {
    const { marcaId } = useParams();
    const [marca, setMarca] = useState<Fornecedor>();
    const [marcaEditada, setMarcaEditada] = useState<Fornecedor>();
    const [editar, setEditar] = useState(false);

    const inative = () => {
        return editar ? false : true;
    }
    const handleCancelar = () => {
        setMarcaEditada(marca);
        setEditar(false);
    };

    useEffect(() => {
        atualizarMarca()
        console.log(marcaId)
    }, []);

    const atualizarMarca = async () => {
        const marca = await marcaPorId(Number(marcaId));
        if (marca) {
            setMarca(marca);
            setMarcaEditada({ ...marca });
        }
    }


    const handleMarcaEditada = (field: keyof Fornecedor) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarcaEditada((prev) =>
            prev ? { ...prev, [field]: e.target.value } : prev
        );
    };

    return (
        <main className="relative flex flex-col w-full min-h-screen">
            <Header title="Editar" subtitle="Marca" />

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 w-full">
                <div className="flex justify-between">
                    <div className="flex justify-center items-center border border-gray-dark rounded w-36 h-36 text-gray-300 text-6xl">
                        {marca ? (
                            <div>
                                <img src={marca.imagemUrl} alt="" />
                            </div>
                        ) : (
                            <ImageIcon fontSize="inherit" />
                        )}
                    </div>

                    <ButtonFile onSelect={(file) => console.log(file)} label="Adicionar Imagem" accept="image/*" />
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-2">
                    <Input
                        label="Nome"
                        name="marca-name"
                        disabled={inative()}
                        value={
                            editar
                                ? marcaEditada?.nome ?? ""
                                : marca?.nome ?? ""
                        }
                        handleChange={handleMarcaEditada("nome")}
                    />
                    <Input
                        label="Descrição"
                        name="marca-description"
                        disabled={inative()}
                        value={
                            editar
                                ? marcaEditada?.descricao ?? ""
                                : marca?.descricao ?? ""
                        }
                        handleChange={handleMarcaEditada("descricao")}
                    />
                    <Input
                        label="CNPJ"
                        name="marca-cnpj"
                        disabled={inative()}
                        value={
                            editar
                                ? marcaEditada?.cnpj ?? ""
                                : marca?.cnpj ?? ""
                        }
                        handleChange={handleMarcaEditada("cnpj")}
                    />
                </div>

                {/* Buttons */}
                {editar ? (
                    <div className="flex flex-col gap-2">
                        <Button label="Confirmar alterações" fullWidth />
                        <Button label="Cancelar" fullWidth variant="outlined" onClick={handleCancelar} />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-2">
                            <Button label="Editar Marca" fullWidth onClick={() => setEditar(!editar)} />
                        </div>
                    </>
                )}


            </div>

        </main>
    )
}