import { Outlet } from "react-router-dom";
import CompanySidebar from "../Company/CompanySidebar";
import CompanyTopbar from "../Company/CompanyTopbar";
import { CompanySearchProvider } from "../../contexts/CompanySearchContext";

export default function CompanyLayout() {
    return (
        <CompanySearchProvider>
            <div className="min-h-screen bg-gradient-to-br from-bolt-primary-50 via-white to-bolt-secondary-50">
                <div className="mx-auto flex max-w-7xl gap-6 px-4 py-10">
                    <CompanySidebar />
                    <div className="flex-1 rounded-3xl border border-bolt-primary-50 bg-white/90 p-6 shadow-lg backdrop-blur">
                        <CompanyTopbar />
                        <div className="mt-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </CompanySearchProvider>
    );
}
