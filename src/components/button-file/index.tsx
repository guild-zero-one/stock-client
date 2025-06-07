import { useState } from "react";

interface ButtonFileProps {
    onSelect: (file: File | null) => void;
    label?: string;
    accept?: string;
    maxSizeMB?: number;
}

export default function ButtonFile({ onSelect, label = "Escolher arquivo", accept, maxSizeMB = 4 }: ButtonFileProps) {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file ? file.name : null);

        if (file) {
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                alert(`O arquivo ultrapassa o limite de ${maxSizeMB}MB.`);
                onSelect(null);
                return;
            }
        }

        onSelect(file);
    };

    return (
        <div className="relative flex flex-col items-start gap- w-fit h-fit">
            <label
                htmlFor="file-upload"
                className="bg-pink-default hover:bg-pink-hovered px-4 py-2 rounded-md font-lexend text-white text-sm cursor-pointer"
            >
                {label}
            </label>
            <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleChange}
            />
            <span className="top-full absolute mt-2 w-full overflow-hidden text-xs truncate whitespace-nowrap">
                {fileName || "Nenhum arquivo selecionado"}
            </span>


        </div>
    );
}
