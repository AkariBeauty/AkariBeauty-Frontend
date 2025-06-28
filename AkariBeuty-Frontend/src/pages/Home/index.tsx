import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Empresa from "../Empresa";

export default function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token") || !localStorage.getItem("typeUser")) {
            navigate("/login");
        }
    }, []);

    let typeUser = localStorage.getItem("typeUser");

    if (!typeUser) {
        return <h1>Home</h1>;
    }

    if (typeUser === "empresa") {
        return <Empresa />;
    }

    if (typeUser === "cliente") {
        return <h1>Cliente</h1>;
    }

    if (typeUser === "profissional") {
        return <h1>Funcionario</h1>;
    }

    if (typeUser === "usuario") {
        return <h1>Usuario</h1>;
    }
}
