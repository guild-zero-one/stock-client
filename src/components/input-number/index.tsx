export default function InputNumber({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <div className="flex items-center justify-between border border-gray-300 rounded-sm gap-2 px-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="text-md text-gray-500 hover:text-black disabled:opacity-30"
      >
        −
      </button>
      <span className="text-xs font-medium select-none">{value}</span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="text-md text-gray-500 hover:text-black disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
