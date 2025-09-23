import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputLogin from "../../components/InputLogin";
import { User, Envelope, Key, Phone, MapPin, UserPlus } from "@phosphor-icons/react";
import BaseService from "../../services/Generic/BaseService";
import AlertModal from "../../components/AlertModal";

export default function SingupCliente() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        uf: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: "",
        login: "",
        senha: "",
        telefone: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setModalError(false);
        setModalSuccess(false);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            console.log("Tentando cadastrar cliente:", formData);
            
            const service = new BaseService({
                method: "post",
                url: "cliente", // O endpoint para cadastro de cliente é /api/v1/cliente
                data: {
                    nome: formData.nome,
                    cpf: formData.cpf,
                    uf: formData.uf,
                    cidade: formData.cidade,
                    bairro: formData.bairro,
                    rua: formData.rua,
                    numero: parseInt(formData.numero) || 0,
                    login: formData.login,
                    senha: formData.senha,
                    telefone: formData.telefone,
                },
                headers: null
            });

            const response = await service.request();
            
            console.log("Resposta do cadastro:", response);
            
            if (response.status === 200 || response.status === 201) { 
                setSuccessMessage("Cliente cadastrado com sucesso! Redirecionando para login...");
                setModalSuccess(true);
                setTimeout(() => {
                    navigate("/login"); 
                }, 2000);
            } else {
                // Se o backend retornar um erro com 'message', exibe-o
                setErrorMessage(response.data?.message || response.data || "Erro desconhecido ao cadastrar.");
                setModalError(true);
            }
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            if (error.response?.data) {
                // Tenta pegar a mensagem de erro do backend
                setErrorMessage(error.response.data.message || error.response.data || "Erro ao cadastrar cliente. Tente novamente.");
            } else {
                setErrorMessage("Erro de conexão ou servidor. Tente novamente.");
            }
            setModalError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Cadastro de Cliente
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputLogin
                                id="nome"
                                label="Nome Completo"
                                type="text"
                                placeholder="Seu nome completo"
                                icon={<User size={24} className="text-primary" />}
                                action={handleInputChange("nome")}
                                value={formData.nome}
                            />
                            
                            <InputLogin
                                id="cpf"
                                label="CPF"
                                type="text"
                                placeholder="000.000.000-00"
                                icon={<User size={24} className="text-primary" />}
                                action={handleInputChange("cpf")}
                                value={formData.cpf}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputLogin
                                id="uf"
                                label="UF"
                                type="text"
                                placeholder="SP"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange("uf")}
                                value={formData.uf}
                            />
                            
                            <InputLogin
                                id="cidade"
                                label="Cidade"
                                type="text"
                                placeholder="São Paulo"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange("cidade")}
                                value={formData.cidade}
                            />
                            
                            <InputLogin
                                id="bairro"
                                label="Bairro"
                                type="text"
                                placeholder="Centro"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange("bairro")}
                                value={formData.bairro}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <InputLogin
                                    id="rua"
                                    label="Rua"
                                    type="text"
                                    placeholder="Rua das Flores"
                                    icon={<MapPin size={24} className="text-primary" />}
                                    action={handleInputChange("rua")}
                                    value={formData.rua}
                                />
                            </div>
                            
                            <InputLogin
                                id="numero"
                                label="Número"
                                type="text"
                                placeholder="123"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange("numero")}
                                value={formData.numero}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputLogin
                                id="telefone"
                                label="Telefone"
                                type="text"
                                placeholder="(11) 99999-9999"
                                icon={<Phone size={24} className="text-primary" />}
                                action={handleInputChange("telefone")}
                                value={formData.telefone}
                            />
                            
                            <InputLogin
                                id="login"
                                label="Email/Login"
                                type="email"
                                placeholder="seu@email.com"
                                icon={<Envelope size={24} className="text-primary" />}
                                action={handleInputChange("login")}
                                value={formData.login}
                            />
                        </div>

                        <InputLogin
                            id="senha"
                            label="Senha"
                            type="password"
                            placeholder="Sua senha"
                            icon={<Key size={24} className="text-primary" />}
                            action={handleInputChange("senha")}
                            value={formData.senha}
                        />

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/login")} 
                                className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Cadastrando..." : "Cadastrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <AlertModal isOpen={modalError} show={setModalError} message={errorMessage} />
            <AlertModal isOpen={modalSuccess} show={setModalSuccess} message={successMessage} />
        </div>
    );
}

