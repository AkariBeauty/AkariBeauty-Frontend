import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";

type TypeInput = "text" | "email" | "password";

interface InputLoginProps {
  id: string;
  label?: string;
  type: TypeInput;
  icon?: React.ReactNode;
  placeholder?: string;
  action: (text: string) => void;
  /** novo: permite controlar o input de fora */
  value?: string;
}

export default function InputLogin({
  id,
  label,
  type,
  icon = null,
  placeholder = "",
  action,
  value,
}: InputLoginProps) {
  const [typeInput, setTypeInput] = useState<TypeInput>(type);

  return (
    <>
      <div className="flex flex-col gap-1">
        {label ? <label className="text-2xl w-full ">{label}</label> : null}
        <div
          tabIndex={0}
          className="relative flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[50px] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary"
        >
          {icon}
          <input
            type={typeInput ?? undefined}
            name={id}
            id={id}
            className="w-full h-full focus:outline-none px-2"
            placeholder={placeholder}
            value={value ?? ""}  
            onChange={(e) => action(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() =>
              setTypeInput(typeInput === "password" ? "text" : "password")
            }
            tabIndex={-1}
          >
            {type === "password"
              ? typeInput === "password"
                ? <Eye size={20} />
                : <EyeSlash size={20} />
              : null}
          </button>
        </div>
      </div>
    </>
  );
}
