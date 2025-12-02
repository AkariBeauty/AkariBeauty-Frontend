import { CalendarDots, ChatsCircle } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfessionalHeader() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Profissional";

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-bolt-primary-100 px-4 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bolt-primary-600 to-bolt-secondary-500 text-white font-bold text-xl flex items-center justify-center">
            {firstName.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-bolt-neutral-500">Bem-vindo de volta</p>
            <h1 className="text-xl font-semibold text-bolt-neutral-900">{firstName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl border border-bolt-primary-100 hover:border-bolt-primary-300 transition-colors">
            <CalendarDots size={22} className="text-bolt-primary-500" />
          </button>
          <button className="p-3 rounded-2xl border border-bolt-primary-100 hover:border-bolt-primary-300 transition-colors">
            <ChatsCircle size={22} className="text-bolt-primary-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
