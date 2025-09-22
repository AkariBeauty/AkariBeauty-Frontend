import { Envelope, Key, SignIn } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import LoginTabs from "../../components/LoginTabs";
import { useState } from "react";
import InputLogin from "../../components/InputLogin";
import api from "../../services/api";
import AlertModal from "../../components/AlertModal";

type UserType = "cliente" | "profissional" | "empresa" | "usuario" | null;

export default function FormLogin() {
    const navigate = useNavigate();

    const [typeUser, setTypeUser] = useState<UserType>("cliente"); // Definindo "cliente" como padrão
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [modalError, setModalError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loginService = async () => {
        console.log('=== INÍCIO DO LOGIN ===');
        console.log('typeUser:', typeUser);
        console.log('login:', login);
        console.log('password:', password);
        
        if (!typeUser) {
            console.log('ERRO: typeUser não definido');
            setModalError(true);
            return;
        }

        if (!login || !password) {
            console.log('ERRO: login ou password vazios');
            setModalError(true);
            return;
        }

        setIsLoading(true);

        try {
            console.log('Tentando login para:', typeUser, 'com dados:', { login, senha: '***' });
            
            // Chamada para sua API web existente
            const response = await api.patch(`/${typeUser}/login`, {
                Login: login,
                Password: password
            });

            console.log('Resposta da API:', response);

            if (response.status === 200 && response.data) {
                // Armazenar token e dados do usuário
                const token = response.data.token || response.data.accessToken || response.data;
                const userData = response.data.user || response.data;
                
                console.log('Token recebido:', token);
                console.log('Dados do usuário:', userData);
                
                localStorage.setItem("akari_token", token);
                localStorage.setItem("akari_user", JSON.stringify({
                    name: userData.nome || userData.name || login,
                    login: login,
                    type: typeUser,
                    id: userData.id
                }));

                // Redirecionar baseado no tipo de usuário
                if (typeUser === "cliente") {
                    navigate("/cliente/dashboard");
                } else {
                    navigate("/home");
                }
                return;
            }

            // Se chegou aqui, login falhou
            console.log('Login falhou - resposta inválida');
            setModalError(true);
            clearForm();

        } catch (error: unknown) {
            console.error('Erro no login:', error);
            
            // Tratar diferentes tipos de erro da API
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as { response?: { status?: number, data?: any } };
                
                console.log('Erro da API:', apiError.response);
                
                if (apiError.response?.status === 401) {
                    // Credenciais inválidas
                    console.log('Credenciais inválidas');
                    setModalError(true);
                } else if (apiError.response?.status === 404) {
                    // Endpoint não encontrado - verificar se a rota está correta
                    console.error('Endpoint não encontrado. Verifique se a rota está correta na sua API.');
                    setModalError(true);
                } else {
                    // Erro de conexão ou servidor
                    console.log('Erro de conexão ou servidor');
                    setModalError(true);
                }
            } else {
                // Erro genérico
                console.log('Erro genérico');
                setModalError(true);
            }
            
            clearForm();
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        const loginElement = document.getElementById("login") as HTMLInputElement | null;
        const passwordElement = document.getElementById("password") as HTMLInputElement | null;

        if (loginElement) {
            loginElement.value = "";
        }
        if (passwordElement) {
            passwordElement.value = "";
        }
        
        setLogin("");
        setPassword("");
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
                    label="Login"
                    type="text"
                    placeholder="Seu login ou email"
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
                            <SignIn size={28} weight="bold" className="text-center mr-2"/> LOG IN
                        </>
                    )}
                </button>
            </div>

            {/* Credenciais de demonstração */}
            <div className="w-full text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-10">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                        💡 Credenciais do Banco de Dados:
                    </p>
                    <div className="text-xs text-blue-700 space-y-1">
                        <p><strong>Joana:</strong> joana@gmail.com / 1234</p>
                        <p><strong>Marcos:</strong> marcos / abcd</p>
                        <p><strong>Ana:</strong> ana.costa / senha123</p>
                    </div>
                </div>
            </div>

            <AlertModal isOpen={modalError} show={setModalError} message="Login ou senha inválidos!" />
        </div>
    );
}
