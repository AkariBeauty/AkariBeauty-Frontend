import { NavLink } from "react-router-dom";
import { COMPANY_MODULES } from "../../pages/Company/modules";
import { Buildings, ChartLineUp, GearSix } from "@phosphor-icons/react";

const baseLinkClasses =
    "flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors duration-200";

export default function CompanySidebar() {
    return (
        <aside className="hidden lg:flex lg:w-72 lg:flex-col gap-6 rounded-3xl border border-bolt-primary-50 bg-white/90 p-6 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-400 text-white">
                    <Buildings size={24} />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                        Akari Beauty
                    </p>
                    <h2 className="text-lg font-semibold text-bolt-neutral-900">Central Empresa</h2>
                </div>
            </div>

            <nav className="flex-1 space-y-5">
                <div>
                    <p className="text-xs uppercase tracking-wide text-bolt-neutral-400 mb-3">
                        Prioridade
                    </p>
                    <div className="space-y-2">
                        {COMPANY_MODULES.map((module) => (
                            <NavLink
                                key={module.id}
                                to={module.path}
                                className={({ isActive }) =>
                                    `${baseLinkClasses} ${
                                        isActive
                                            ? "bg-bolt-primary-600 text-white shadow-md"
                                            : "text-bolt-neutral-500 bg-white hover:bg-bolt-primary-50 hover:text-bolt-neutral-900"
                                    }`
                                }
                            >
                                <ChartLineUp size={18} />
                                <span>{module.title}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-bolt-primary-100 bg-bolt-primary-50 p-4">
                    <GearSix size={20} className="text-bolt-primary-600" />
                    <div className="text-sm text-bolt-neutral-600">
                        <p className="font-semibold text-bolt-neutral-900">
                            Precisa de outro módulo?
                        </p>
                        <p>Consulte a área de configurações.</p>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
