type DropdownAddProps = {
    text: string;
    icon?: React.ReactNode
}

export default function DropdownItem({
    text,
    icon
}: DropdownAddProps) {
    return (

        <li className="flex items-center gap-2 hover:bg-gray-default px-4 py-2 font-medium whitespace-nowrap shrink-0">
            <span>{icon}</span>
            {text}
        </li>

    )
}