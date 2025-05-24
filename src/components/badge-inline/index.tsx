interface badgeInlineProps {
    children?: React.ReactNode;
}

export default function BadgeInline({ children }: badgeInlineProps) {
    return (
        <div className="inline-block bg-pink-default px-2 rounded-2xl">
            <span className="text-white text-xs/tight">
                {children}
            </span>
        </div>
    )
}