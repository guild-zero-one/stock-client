interface badgeInlineProps {
    children?: React.ReactNode;
    value?: number;
}

export default function BadgeInline({ value = 0 }: badgeInlineProps) {
    return (
        <div className={`flex justify-center items-center ${value === 0 ? "bg-text-desactive" : "bg-pink-default"} px-2 py-0.5 rounded-2xl h-fit`}>
            <span className="text-[10px] text-white">
                {value}
            </span>
        </div>
    )
}