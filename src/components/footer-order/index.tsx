import Button from "../button";

interface OrderFooterProps {
  total: number;
  onConfirm: () => void;
}

export default function FooterOrder({ total, onConfirm }: OrderFooterProps) {
  return (
    <div className="fixed bottom-0 z-50 flex items-center justify-between gap-4 p-4 w-full rounded-t-xl shadow-[0_-2px_8px_-1px_rgba(0,0,0,0.1)] bg-white">
      <div className="flex flex-col items-start justify-between">
        <h2 className="text-sm text-text-secondary font-bold">Total</h2>
        <p className="text-lg font-bold">R$ {total.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button label="Cancelar" variant="outlined" size="small" />
        <Button label="Finalizar" size="small" />
      </div>
    </div>
  );
}
