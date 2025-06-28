import { Envelope, Key, SignIn } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import LoginTabs from "../../components/LoginTabs";
import { useState } from "react";
import InputLogin from "../../components/InputLogin";
import BaseService from "../../services/Generic/BaseService";
import AlertModal from "../../components/AlertModal";

type UserType = "cliente" | "profissional" | "empresa" | "usuario";

export default function FormLogin() {

    const navigate = useNavigate();

    const [typeUser, setTypeUser] = useState<UserType>("cliente");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [modalError, setModalError] = useState(false);

    // Create the service instance only when needed, e.g., in a function
    const loginSevice = () => {

        const service = new BaseService({
            method: "patch",
            url: typeUser + "/login",
            data: {
                "login" : login,
                "password" : password
            },
            auth: false,
            headers: null
        });

        service.request().then((response) => {
            if (response.success === 200) {
                localStorage.setItem("token", response.data);
                localStorage.setItem("typeUser", typeUser);
                navigate("/home");
                return;
            }

            setModalError(true);
            const loginElement = document.getElementById("login") as HTMLInputElement | null;
            const passwordElement = document.getElementById("password") as HTMLInputElement | null;

            if (loginElement) {
                loginElement.value = "";
            }
            if (passwordElement) {
                passwordElement.value = "";
            }

        })
    };

    const tabs = [
        { action: () => setTypeUser("cliente"), label: 'Cliente' },
        { action: () => setTypeUser("profissional"), label: 'Profissional' },
        { action: () => setTypeUser("empresa"), label: 'Empresa' },
        { action: () => setTypeUser("usuario"), label: 'Funcionario' }
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

                <InputLogin id="login" action={(text) => setLogin(text)} label="Email" type="text" placeholder="your@example.com" icon={<Envelope size={32} className="text-primary" />}/>

                <InputLogin id="password" action={(text) => setPassword(text)} label="Senha" type="password" placeholder="Insira sua senha..." icon={<Key size={32} className="text-primary"/>}/>

                <div className="w-full"><a className="underline text-[16px]" href="#">Esqueci minha senha!</a></div>

            </div>

            <div className="w-full flex flex-row justify-center">
                {/* <Button label={"LOG IN"} icon={<SignIn size={28} weight="bold" className="mr-[10px]"/>} action={() => loginSevice()} /> */}
                <button onClick={() => loginSevice()} className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center " type="button"><SignIn size={28} weight="bold" className="text-center"/> LOG IN</button>
            </div>

            <AlertModal isOpen={modalError} show={setModalError} message="Email ou senha inválidos!" />
        </div>
    );
}
