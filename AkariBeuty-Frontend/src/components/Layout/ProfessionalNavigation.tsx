import { CalendarCheck, ClipboardText, UserCircle } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: ClipboardText, label: "Resumo", path: "/profissional/dashboard" },
  { icon: CalendarCheck, label: "Agenda", path: "/profissional/agenda" },
  { icon: UserCircle, label: "Perfil", path: "/profissional/perfil" },
];

export default function ProfessionalNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-bolt-primary-100 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg"
                  : "text-bolt-neutral-600 hover:bg-bolt-primary-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} weight={isActive ? "fill" : "regular"} />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
