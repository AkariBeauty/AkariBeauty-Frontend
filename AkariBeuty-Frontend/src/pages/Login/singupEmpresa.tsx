import { Envelope, SignIn, IdentificationBadge, IdentificationCard } from "@phosphor-icons/react"

export default function SingupEmpresa() {
    return (
        <>
            <span className="text-4xl font-bold underline my-[10%]">Cadastro de Empresa</span>

            <label className="text-2xl w-full mb-1.5">Razão Social</label>

            <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[8%] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary mb-[3%]">
                <IdentificationCard size={32} className="text-primary mr-[10px] "/>
                <input type="text" name="razao" id="razao" className="w-full h-full focus:outline-none" placeholder="Razão social..."/>
            </div>

            <label className="text-2xl w-full mb-1.5">CNPJ</label>

            <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[8%] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary mb-[3%]">
                <IdentificationBadge size={32} className="text-primary mr-[10px] "/>
                <input type="text" onChange={(e) => {e.target.value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")}} name="cnpj" id="cnpj" className="w-full h-full focus:outline-none" placeholder="CNPJ..." maxLength={18}/>
            </div>

            <label className="text-2xl w-full mb-1.5">Email</label>

            <div tabIndex={0} className="flex flex-row items-center justify-center border-primary shadow-[0px_0px_5px_rgba(0,0,0,0.2)] w-full h-[8%] rounded-[7px] px-[10px] border-l-[10px] border-l-primary focus-within:ring-2 focus-within:ring-primary mb-[10px]">
                <Envelope size={32} className="text-primary mr-[10px] "/>
                <input type="email" name="email" id="email" className="w-full h-full focus:outline-none" placeholder="Email..."/>
            </div>

            <div className="mb-[15%] w-full"><a className="underline text-[16px]" href="#">Esqueci minha senha!</a></div>

            <button className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center" type="button"><SignIn size={28} weight="bold" className="mr-[10px]"/>Cadastrar-se</button>
        </>
    );
}
