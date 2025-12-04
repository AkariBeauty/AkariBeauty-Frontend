import type { ReactNode } from "react";

export const companyCardClass = "rounded-2xl border border-bolt-primary-50 bg-white p-5 shadow-sm";

interface CompanyPageHeaderProps {
    title: string;
    subtitle: string;
    actions?: ReactNode;
}

export function CompanyPageHeader({ title, subtitle, actions }: CompanyPageHeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-sm text-bolt-neutral-500">{subtitle}</p>
                <h1 className="text-2xl font-semibold text-bolt-neutral-900">{title}</h1>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </header>
    );
}
