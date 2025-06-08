import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface DetailBrandProps {
  marca?: string;
  quantidadeMarca?: number;
}

export default function DetailBrand({
  marca,
  quantidadeMarca,
}: DetailBrandProps) {
  return (
    <div className="flex flex-col bg-white-default w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <p className="text-xs text-text-secondary uppercase">MARCA</p>
          {marca && (
            <div className="flex items-center gap-1">
              <p className="font-bold">{marca}</p>
              <span className="text-center bg-pink-default rounded-full text-white px-3 py-0.25 text-xs font-normal">
                {quantidadeMarca}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-gray-m-dark">
          <KeyboardArrowDownIcon fontSize="inherit" />
        </div>
      </div>
      <span className="border-1 border-gray-dark w-full"></span>
    </div>
  );
}
