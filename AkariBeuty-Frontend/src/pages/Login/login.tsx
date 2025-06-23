import { Envelope, Key, SignIn } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import LoginTabs from "../../components/LoginTabs";
import { useState } from "react";

type UserType = "cliente" | "profissional" | "empresa" | "usuario" | null;


export default function FormLogin() {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserType>(null);

    const tabs = [
        { action: () => setUser("cliente"), label: 'Cliente' },
        { action: () => setUser("profissional"), label: 'Profissional' },
        { action: () => setUser("empresa"), label: 'Empresa' },
        { action: () => setUser("usuario"), label: 'Funcionario' }
    ];

    return (
        <div className="flex flex-col w-full h-full justify-evenly text-center justify-items-center mt-[3%] mb-[5%]">
            <div className="text-center flex flex-col mt-[5%]">
                <span className="text-4xl font-bold ">Bem-vindo</span>
                <span>Entre com sua conta para continuar</span>
            </div>

            <div className="w-full">
                <LoginTabs tabs={tabs} />
            </div>

            <div className="p-10 w-full text-start flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                    <label className="text-2xl w-full ">Email</label>
                    <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[50px] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary">
                        <Envelope size={32} className="text-primary"/>
                        <input type="email" name="email" id="email" className="w-full h-full focus:outline-none" placeholder="your@example.com"/>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-2xl w-full ">Senha</label>
                    <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[50px] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary ]">
                        <Key size={32} className="text-primary"/>
                        <input type="password" name="password" id="password" className="w-full h-full focus:outline-none" placeholder="Insira sua senha..."/>
                    </div>
                    <div className="w-full"><a className="underline text-[16px]" href="#">Esqueci minha senha!</a></div>
                </div>

            </div>

            <div className="w-full flex flex-row justify-center">
                <button onClick={() => navigate("/home")} className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center " type="submit"><SignIn size={28} weight="bold"/> LOG IN</button>
            </div>
        </div>
    );
}
