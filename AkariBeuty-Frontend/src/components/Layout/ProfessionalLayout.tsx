import { Outlet } from "react-router-dom";
import ProfessionalHeader from "./ProfessionalHeader";
import ProfessionalNavigation from "./ProfessionalNavigation";

export default function ProfessionalLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bolt-secondary-50 via-white to-bolt-primary-50">
      <ProfessionalHeader />
      <main className="pb-24 px-4 max-w-6xl mx-auto">
        <Outlet />
      </main>
      <ProfessionalNavigation />
    </div>
  );
}
