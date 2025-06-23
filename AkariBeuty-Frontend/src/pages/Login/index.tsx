import { useState, useEffect } from "react"
import { SignIn } from "@phosphor-icons/react"
import Logo from "../../assets/logo.png"
import FormLogin from "./login"
import SignupCliente from "./singupCliente"
import SignupEmpresa from "./singupEmpresa"

export default function Login() {
    const [loginSingup, setLoginSingup] = useState('login')

    function alterLoginSingup(text: string) {
        const elemento = document.querySelectorAll(".login")


        elemento[0].classList.toggle("translate-x-[134%]")
        elemento[1].classList.toggle("translate-x-[-67%]")
        elemento[0].classList.toggle("rotate-y-[360deg]")
        elemento[1].classList.toggle("grayscale-50")

        setTimeout(() => {
            setLoginSingup(text)
        }, 500)}

    useEffect(() => {
        const elemento = document.querySelectorAll(".login");

        elemento[0].classList.add("translate-x-[150%]", "opacity-0");
        elemento[1].classList.add("translate-x-[-150%]", "opacity-0");

        setTimeout(() => {
            elemento[0].classList.remove("translate-x-[150%]", "opacity-0");
            elemento[1].classList.remove("translate-x-[-150%]", "opacity-0");
        }, 50);
        }, []);

    return (
        <div className="flex bg-backgound-alt h-screen flex-row items-center justify-center">

            <div className="flex flex-row items-center justify-center space-x-[-40px] ">

                <form className="login w-[620px] h-[680px] bg-background rounded-[12px] z-10 flex flex-col items-center transition-all duration-1500 ease-in-out" style={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)"}}>
                    {loginSingup === "login" ? <FormLogin /> : loginSingup === "cliente" ? <SignupCliente /> : <SignupEmpresa />}
                </form>

                <div className="login grayscale-0 w-[878px] h-[780px] bg-[url(/src/assets/Login/fundo_login.png)] bg-cover bg-no-repeat bg-center rounded-[12px] z-0 sepia-10 flex flex-col items-center p-10 pl-[80px] transition-all duration-1500" style={{boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)"}}>

                    <img src={Logo} alt="Logo da empresa!" className="w-24 drop-shadow-[0_0_7px_theme(colors.background)]"/>
                    <span className="text-textSecondary text-xl text-shadow-[0_0_7px_theme(colors.background)] my-[20%]">✨ <span className="font-bold">Beleza com um clique. Conexões que transformam. </span><br />
                    <br />
                    Encontre os melhores profissionais, agende seu horário com facilidade e se inspire com uma vitrine cheia de estilo e autoestima. <br />
                    Se você vive da beleza ou não abre mão de se cuidar, aqui é o seu lugar. <br />
                    <br />
                    <span className="font-bold">Entre agora ou cadastre-se — seu próximo momento de brilho começa aqui. 💖</span></span>

                    {loginSingup === "login" ? (
                        <div className="flex flex-row items-center justify-center space-x-4 w-full">
                            <div>
                                <button
                                type="button"
                                onClick={() => alterLoginSingup("empresa")}
                                className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center justify-center flex-1/2 "
                                >
                                <SignIn size={28} weight="bold" className="mr-[10px]" />
                                SIGNUP EMPRESA
                                </button>
                            </div>

                            <div>
                                <button
                                type="button"
                                onClick={() => alterLoginSingup("cliente")}
                                className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center justify-center flex-1/2"
                                >
                                <SignIn size={28} weight="bold" className="mr-[10px]" />
                                LOGIN USUÁRIO
                                </button>
                            </div>
                        </div>
                        ) : (
                        <button
                            type="button"
                            onClick={() => alterLoginSingup("login")}
                            className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center"
                        >
                            <SignIn size={28} weight="bold" className="mr-[10px]" />
                            LOGIN
                        </button>
                        )}


                </div>
            </div>
        </div>
    )
}
