import { useState, ReactNode } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center p-4 border-gray-300 border-b-2 w-full"
            >
                <span className={`${isOpen ? "text-pink-default" : "text-text-secondary"} `}>{title}</span>
                <span className="text-pink-default text-xl">  {isOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>} </span>
            </button>

            {isOpen && (
                <div className="bg-white p-4 w-full">
                    {children}
                </div>
            )}
        </div>
    );
}