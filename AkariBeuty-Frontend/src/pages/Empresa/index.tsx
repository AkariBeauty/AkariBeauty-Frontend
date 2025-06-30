import SidebarEmpresa from "../../components/Empresa/SidebarEmpresa";
import LayoutEmpresa from "../../components/Empresa/LayoutEmpresa";
import HeaderEmpresa from "../../components/Empresa/HeaderEmpresa";
import BaseService from "../../services/Generic/BaseService";
import { useEffect, useState } from "react";
import AlertModal from "../../components/AlertModal";
import { useNavigate } from "react-router-dom";
import DashboardEmpresa from "./DashboardEmpresa";

export default function Empresa() {

    const [name, setName] = useState("Usuário");
    const [modalError, setModalError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getNameUser();
    }, []);

    function getNameUser() {
        const service = BaseService({
            method: "get",
            url: "empresa/user",
            auth: true,
        });

        service.request().then((response) => {
            if (response.success === 200) {
                setName(response.data["nome"]);
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("typeUser");
            navigate("/login");

        }).catch(() => {
            setModalError(true);
        });
    }

    return (
        <>
            <AlertModal isOpen={modalError} show={setModalError} message="Error" />
            <LayoutEmpresa
                sidebar={<SidebarEmpresa page="home" />}
                header={<HeaderEmpresa user={{ name: name }} />}
                content={<DashboardEmpresa />}
            />
        </>
    );
}
