interface ButtonProps
{
    label? : string | null,
    icon? : React.ReactNode | null,
    background? : string | null,
    color? : string | null,
    size? : string | null,
    type? : "button" | "submit" | "reset" | null,
    action: () => void
}

export default function Button({label = null, icon = null, background = null, color = null, size = null, type = null, action } : ButtonProps)
{
    return (
        <button
            type={`${type ? type : "button"}`}
            onClick={action}
            className={`p-2.5 px-3.5 rounded-lg ${background ? background : "bg-primary"} ${ size ? size : "text-2xl"} ${color ? color : "text-textSecondary"} font-bold cursor-pointer flex flex-row items-center justify-center min-h-0`}
            >
            {icon}
            {label}
        </button>
    );
}
