import { Envelope, Key, SignIn } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginTabs from "../../components/LoginTabs";
import InputLogin from "../../components/InputLogin";
import AlertModal from "../../components/AlertModal";
import { useAuth } from "../../contexts/AuthContext";

type UserType = "cliente" | "profissional" | "empresa" | "usuario" | null;

export default function FormLogin() {
    const navigate = useNavigate();
    const { login: loginWithAuth } = useAuth();

    const [typeUser, setTypeUser] = useState<UserType>("cliente");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [modalError, setModalError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const redirectByType: Record<Exclude<UserType, null>, string> = {
        cliente: "/cliente/dashboard",
        profissional: "/profissional/dashboard",
        empresa: "/empresa/resumo",
        usuario: "/home",
    };

    const loginService = async () => {
        if (!typeUser) return;
        setIsLoading(true);
        try {
            const ok = await loginWithAuth(login, password, { type: typeUser });
            if (ok) {
                const target = redirectByType[typeUser] ?? "/cliente/dashboard";
                navigate(target);
                return;
            }
            setModalError(true);
            clearForm();
        } catch (error: unknown) {
            console.error("Erro no login:", error);
            setModalError(true);
            clearForm();
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setLogin("");
        setPassword("");
    };

    const tabs = [
        { action: () => setTypeUser("cliente"), label: "Cliente" },
        { action: () => setTypeUser("profissional"), label: "Profissional" },
        { action: () => setTypeUser("empresa"), label: "Empresa" },
        { action: () => setTypeUser("usuario"), label: "Funcionario" },
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
                    value={login}
                    label="Login"
                    type="text"
                    placeholder="Seu login ou email"
                    icon={<Envelope size={32} className="text-primary" />}
                />

                <InputLogin
                    id="senha"
                    action={(text) => setPassword(text)}
                    value={password}
                    label="Senha"
                    type="password"
                    placeholder="Insira sua senha..."
                    icon={<Key size={32} className="text-primary" />}
                />

                <div className="w-full">
                    <a className="underline text-[16px]" href="#">
                        Esqueci minha senha!
                    </a>
                </div>
            </div>

            <div className="w-full flex flex-row justify-center">
                <button
                    onClick={loginService}
                    disabled={isLoading}
                    className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center disabled:opacity-50"
                    type="button"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                            CONECTANDO...
                        </>
                    ) : (
                        <>
                            <SignIn size={28} weight="bold" className="text-center mr-2" /> LOG IN
                        </>
                    )}
                </button>
            </div>
            <AlertModal
                isOpen={modalError}
                show={setModalError}
                message="Login ou senha inválidos!"
            />
        </div>
    );
}
