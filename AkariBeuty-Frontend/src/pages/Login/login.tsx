import { Envelope, Key, SignIn } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import LoginTabs from "../../components/LoginTabs";
import { useState } from "react";
import InputLogin from "../../components/InputLogin";
import AlertModal from "../../components/AlertModal";
import BaseService from "../../services/Generic/BaseService";

type UserType = "cliente" | "profissional" | "empresa" | "usuario" | null;

export default function FormLogin() {
    const navigate = useNavigate();

    const [typeUser, setTypeUser] = useState<UserType>(null);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [modalError, setModalError] = useState(false);

    const loginService = async () => {
        if (!typeUser) {
            setModalError(true);
            return;
        }

        try {
            const service = new BaseService({
                method: "patch",
                url: `${typeUser}/login`,
                data: { login, password },
                auth: false,
                headers: null
            });

            const response = await service.request();
            if (response.success === 200 && response.data) {
                // Ajuste conforme o contrato do seu backend
                const token = typeof response.data === 'string' ? response.data : (response.data.token || response.data.accessToken);
                if (token) {
                    localStorage.setItem("akari_token", token);
                }

                // Persistir um mínimo de info do usuário para o AuthProvider carregar
                localStorage.setItem("akari_user", JSON.stringify({
                    id: "local",
                    name: login,
                    email: login,
                    phone: ""
                }));

                // Forçar recarregar para AuthProvider ler o localStorage imediatamente
                const target = typeUser === "cliente" ? "/cliente/dashboard" : "/home";
                window.location.href = target;
                return;
            }
        } catch (err) {
            // silencioso, cai no modal
        }

        setModalError(true);
        const loginElement = document.getElementById("login") as HTMLInputElement | null;
        const passwordElement = document.getElementById("password") as HTMLInputElement | null;
        if (loginElement) loginElement.value = "";
        if (passwordElement) passwordElement.value = "";
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
                <InputLogin 
                    id="login" 
                    action={(text) => setLogin(text)} 
                    label="Email" 
                    type="text" 
                    placeholder="your@example.com" 
                    icon={<Envelope size={32} className="text-primary" />}
                />

                <InputLogin 
                    id="password" 
                    action={(text) => setPassword(text)} 
                    label="Senha" 
                    type="password" 
                    placeholder="Insira sua senha..." 
                    icon={<Key size={32} className="text-primary"/>}
                />

                <div className="w-full">
                    <a className="underline text-[16px]" href="#">Esqueci minha senha!</a>
                </div>
            </div>

            <div className="w-full flex flex-row justify-center">
                <button 
                    onClick={loginService} 
                    className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center" 
                    type="button"
                >
                    <SignIn size={28} weight="bold" className="text-center mr-2"/> LOG IN
                </button>
            </div>

            <AlertModal isOpen={modalError} show={setModalError} message="Email ou senha inválidos!" />
        </div>
    );
}
