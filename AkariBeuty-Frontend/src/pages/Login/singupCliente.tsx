import { Envelope, Key, UserPlus } from "@phosphor-icons/react"
import { useState } from "react";
import InputLogin from "../../components/InputLogin";
import BaseService from "../../services/Generic/BaseService";
import AlertModal from "../../components/AlertModal";
import { useNavigate } from "react-router-dom";

export default function SingupCliente() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modalError, setModalError] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);

    const registerService = () => {
        const service = new BaseService({
            method: "post",
            url: "cliente", // Assuming the client registration endpoint is /api/v1/cliente
            data: {
                "login": email,
                "senha": password
            },
            auth: false,
            headers: null
        });

        service.request().then((response) => {
            if (response.status === 201) { // Assuming 201 Created for successful registration
                setModalSuccess(true);
                setTimeout(() => {
                    navigate("/login"); // Redirect to login after successful registration
                }, 2000);
                return;
            }
            setModalError(true);
        }).catch(() => {
            setModalError(true);
        });
    };

    return (
        <div className="flex flex-col w-full h-full justify-evenly text-center justify-items-center mt-[3%] mb-[5%]">
            <div className="text-center flex flex-col mt-[5%]">
                <span className="text-4xl font-bold ">Cadastro de Cliente</span>
                <span>Preencha seus dados para criar uma conta</span>
            </div>

            <div className="p-10 w-full text-start flex flex-col gap-10">
                <InputLogin id="email" action={(text) => setEmail(text)} label="Email" type="email" placeholder="seu@exemplo.com" icon={<Envelope size={32} className="text-primary" />} />
                <InputLogin id="password" action={(text) => setPassword(text)} label="Senha" type="password" placeholder="Insira sua senha..." icon={<Key size={32} className="text-primary" />} />
            </div>

            <div className="w-full flex flex-row justify-center">
                <button onClick={registerService} className="p-2.5 px-3.5 rounded-lg bg-primary text-2xl text-textSecondary font-bold cursor-pointer flex flex-row items-center " type="button">
                    <UserPlus size={28} weight="bold" className="text-center" /> CADASTRAR
                </button>
            </div>

            <AlertModal isOpen={modalError} show={setModalError} message="Erro ao cadastrar! Verifique os dados." />
            <AlertModal isOpen={modalSuccess} show={setModalSuccess} message="Cadastro realizado com sucesso!" />
        </div>
    );
}

