import { Envelope, Key, SignIn } from "@phosphor-icons/react"


export default function SingupCliente() {

    return (
    <>
        <span className="text-4xl font-bold underline my-[10%]">Cliente Akari Beauty</span>

        <label className="text-2xl w-full mb-1.5">Email</label>

        <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[8%] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary mb-[10%]">
            <Envelope size={32} className="text-primary mr-[10px] "/>
            <input type="email" name="email" id="email" className="w-full h-full focus:outline-none" placeholder="your@example.com"/>
        </div>

        <label className="text-2xl w-full mb-1.5">Senha</label>

        <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[8%] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary mb-[10px]">
            <Key size={32} className="text-primary mr-[10px] "/>
            <input type="password" name="password" id="password" className="w-full h-full focus:outline-none" placeholder="Insira sua senha..."/>
        </div>

        <div className="mb-[15%] w-full"><a className="underline text-[16px]" href="#">Esqueci minha senha!</a></div>

        <button className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center" type="submit"><SignIn size={28} weight="bold" className="mr-[10px]"/> LOG IN</button>
    </>
    );
}
