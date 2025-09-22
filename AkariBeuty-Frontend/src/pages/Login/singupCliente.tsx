import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import InputLogin from "../../components/InputLogin";
import { User, Envelope, Key, Phone, MapPin } from "@phosphor-icons/react";

export default function SingupCliente() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        uf: "",
        cidade: "",
        bairro: "",
        rua: "",
        numero: 0,
        login: "",
        senha: "",
        telefone: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'numero' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log('Tentando cadastrar cliente:', formData);
            
            const response = await api.post('/cliente', formData);
            
            console.log('Resposta do cadastro:', response);
            
            if (response.status === 200) {
                setSuccess("Cliente cadastrado com sucesso! Redirecionando para login...");
                setTimeout(() => {
                    navigate("/login-bolt");
                }, 2000);
            }
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            
            if (error.response?.status === 400) {
                setError(error.response.data || "Dados inválidos. Verifique os campos.");
            } else {
                setError("Erro ao cadastrar cliente. Tente novamente.");
            }
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
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputLogin
                                id="nome"
                                label="Nome Completo"
                                type="text"
                                placeholder="Seu nome completo"
                                icon={<User size={24} className="text-primary" />}
                                action={handleInputChange('nome')}
                            />
                            
                            <InputLogin
                                id="cpf"
                                label="CPF"
                                type="text"
                                placeholder="000.000.000-00"
                                icon={<User size={24} className="text-primary" />}
                                action={handleInputChange('cpf')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputLogin
                                id="uf"
                                label="UF"
                                type="text"
                                placeholder="SP"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange('uf')}
                            />
                            
                            <InputLogin
                                id="cidade"
                                label="Cidade"
                                type="text"
                                placeholder="São Paulo"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange('cidade')}
                            />
                            
                            <InputLogin
                                id="bairro"
                                label="Bairro"
                                type="text"
                                placeholder="Centro"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange('bairro')}
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
                                    action={handleInputChange('rua')}
                                />
                            </div>
                            
                            <InputLogin
                                id="numero"
                                label="Número"
                                type="text"
                                placeholder="123"
                                icon={<MapPin size={24} className="text-primary" />}
                                action={handleInputChange('numero')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputLogin
                                id="telefone"
                                label="Telefone"
                                type="text"
                                placeholder="(11) 99999-9999"
                                icon={<Phone size={24} className="text-primary" />}
                                action={handleInputChange('telefone')}
                            />
                            
                            <InputLogin
                                id="login"
                                label="Email/Login"
                                type="email"
                                placeholder="seu@email.com"
                                icon={<Envelope size={24} className="text-primary" />}
                                action={handleInputChange('login')}
                            />
                        </div>

                        <InputLogin
                            id="senha"
                            label="Senha"
                            type="password"
                            placeholder="Sua senha"
                            icon={<Key size={24} className="text-primary" />}
                            action={handleInputChange('senha')}
                        />

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/login-bolt")}
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
        </div>
    );
}
