import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'default';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled = false,
    size = 'default',
    variant = 'filled',
    fullWidth = false,
    type = 'button'
}) => {

    const buttonSizeClasses = {
        small: 'text-sm px-[10px] py-[4px]',
        default: 'text-base px-[16px] py-[6px]',
    };

    const buttonVariantClasses = {
        outlined: 'border border-pink-default bg-transparent hover:bg-pink-default hover:bg-pink-default text-pink-default hover:text-white',
        filled: 'bg-pink-default text-white hover:bg-pink-hovered',
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                 h-fit text-nowrap ${fullWidth ? 'w-full' : 'w-fit'} font-[lexend] font-medium btn rounded transition-colors ease-linear ${buttonSizeClasses[size]} ${buttonVariantClasses[variant]} cursor-pointer focus:outline-none 
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {label}
        </button>
    );
};

export default Button;