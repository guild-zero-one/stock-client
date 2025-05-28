interface SwitchProps {
    id?: string;
    checked?: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}


export default function Switch(
    { id, checked = false, onChange, disabled = false }: SwitchProps
) {
    return (
        <label htmlFor={id} className="inline-flex items-center cursor-pointer">
            <input
                id={id}
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />

            {/* Corpo */}
            <div className={`w-9 h-6 ml-1.5 rounded-full peer-checked:bg-pink-default/40 bg-gray-300 relative transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {/* Circulo */}
                <div className={`w-7 h-7 rounded-full absolute top-1/2 -translate-y-1/2 transition-transform ${checked ? 'left-full -translate-x-1/2 bg-pink-default' :  'left-0 -translate-x-1/2 bg-gray-default'}`} />
            </div>

        </label>
    );
}