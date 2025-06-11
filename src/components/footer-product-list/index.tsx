import Button from "../button";

interface OrderFooterProps {
    total: number;
    onCancel?: () => void;
    onConfirm?: () => void;
    onAdd?: () => void;
}

export default function FooterProductList({
    total,
    onCancel,
    onConfirm,
    onAdd
}: OrderFooterProps) {
    return (
        <div className="bottom-0 z-40 fixed flex justify-between items-center gap-4 bg-white shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.1)] p-4 rounded-t-xl w-full">
            <div className="flex flex-col justify-between items-start">
                <h2 className="font-bold text-text-secondary text-xs">Total</h2>
                <p className="font-bold text-sm">R$ {total.toFixed(0)}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={onCancel}
                    label="Cancelar"
                    variant="outlined"
                    size="small"
                />
                <Button
                    label="Adicionar Produtos"
                    onClick={onAdd}
                    size="small"
                />
                <Button onClick={onConfirm} label="Finalizar" size="small" />
            </div>
        </div>
    );
}
