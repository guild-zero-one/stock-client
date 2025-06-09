import { useState, ReactNode } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BadgeInline from '@/components/badge-inline';

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    badgeValue?: number;
}

export default function Accordion({ title, children, defaultOpen = false, badgeValue }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center p-4 border-gray-300 border-b-2 w-full"
            >
                <div className={`flex flex-col place-items-start ${isOpen ? "text-pink-default" : "text-text-secondary"} `}>
                    <span className='text-text-secondary text-xs'>Marcas</span>
                    <div className='flex place-items-center gap-2 w-full h-full'>
                        {title}
                        <BadgeInline value={badgeValue} />
                    </div>
                </div>
                <span className="text-pink-default text-xl">  {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} </span>
            </button>

            {isOpen && (
                <div className="py-2 w-full">
                    {children}
                </div>
            )}
        </div>
    );
}