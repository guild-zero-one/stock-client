'use client'

import { Icon } from "@mui/material"
import React from "react"

type MenuLinkProps = {
    icon: React.ReactElement<{ fontSize?: string }>
    label: string
}

export default function MenuLink({
    icon,
    label,
}: MenuLinkProps) {

    return (
        <div className="group relative col-span-1 bg-gray-dark rounded-2xl w-full h-full overflow-hidden hover:text-pink-default">

            {/* Conteúdo */}
            <div className="z-12 relative flex flex-col justify-center items-start p-4 w-full h-full">
                {React.cloneElement(icon, { fontSize: "medium" })}
                <span className="font-medium text-[clamp(1rem, 3.45vw, 2rem)]">{label}</span>
            </div>

            {/* Camada de Efeito*/}
            <span className="top-1/2 left-1/2 z-0 absolute inset-0 bg-gray-dark-hovered rounded-full w-100 h-100 aspect-[1/1] scale-0 group-hover:scale-[2] transition-transform -translate-1/2 duration-300 ease-in-out" />
        </div>
    )
}