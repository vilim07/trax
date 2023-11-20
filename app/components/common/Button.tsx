
export default function Button({ children, className, disabled, type, onClick }: { children: React.ReactNode; className?: string, disabled?: boolean; type?: 'button' | 'submit' | 'reset'; onClick?: () => void }) {
    return (
        <button type={type}
            disabled={disabled}
            aria-disabled={disabled}
            className={"text-white h-[36px] text-sm font-bold rounded-[3px] " + className}
            onClick={onClick}
            >
            {children}
        </button>
    )
}