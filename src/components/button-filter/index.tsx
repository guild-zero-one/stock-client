type ButtonFilterProps = {
  active?: boolean;
  title: string;
  onClick?: () => void;
};

export default function ButtonFilter({
  active,
  title,
  onClick,
}: ButtonFilterProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 w-full p-2 transition-colors duration-300
          ${active ? "text-white" : "text-gray-500"}
        `}
    >
      {title}
    </button>
  );
}
