import { Envelope, Key, SignIn } from "@phosphor-icons/react"
import Logo from "../../assets/logo.png"

export default function Login() {
    return (
        <div className="flex bg-backgound-alt h-screen flex-row items-center justify-center">

            <div className="flex flex-row items-center justify-center space-x-[-40px] ">

                <form className="w-[620px] h-[680px] bg-background rounded-[12px] z-10 flex flex-col items-center p-10" style={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)"}}>

                    <span className="text-4xl font-bold underline my-[10%]">Login Akari Beauty</span>

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
                </form>

                <div className="w-[878px] h-[780px] bg-[url(/src/assets/Login/fundo_login.png)] bg-cover bg-no-repeat bg-center rounded-[12px] z-0 sepia-10 flex flex-col items-center p-10 pl-[80px]" style={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)"}}>

                    <img src={Logo} alt="Logo da empresa!" className="w-24 drop-shadow-[0_0_7px_theme(colors.background)]"/>
                    <span className="text-textSecondary text-xl text-shadow-[0_0_7px_theme(colors.background)] my-[20%]">✨ <span className="font-bold">Beleza com um clique. Conexões que transformam. </span><br />
                    <br />
                    Encontre os melhores profissionais, agende seu horário com facilidade e se inspire com uma vitrine cheia de estilo e autoestima. <br />
                    Se você vive da beleza ou não abre mão de se cuidar, aqui é o seu lugar. <br />
                    <br />
                    <span className="font-bold">Entre agora ou cadastre-se — seu próximo momento de brilho começa aqui. 💖</span></span>
                    <a href="#" className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center" ><SignIn size={28} weight="bold" className="mr-[10px]"/>SINGUP</a>
                </div>
            </div>
        </div>
    )
}
