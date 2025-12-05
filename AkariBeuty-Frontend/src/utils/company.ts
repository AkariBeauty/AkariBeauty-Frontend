import type { User } from "../types";

export const normalizeEmpresaIdentifier = (value?: string | number | null): number | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "number") {
        return Number.isNaN(value) ? undefined : value;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

export const resolveEmpresaIdFromUser = (user?: User | null): number | undefined => {
    if (!user) return undefined;
    return (
        normalizeEmpresaIdentifier(user.empresaId ?? null) ?? normalizeEmpresaIdentifier(user.id)
    );
};

export const resolveEmpresaIdFromStorage = (): number | undefined => {
    if (typeof window === "undefined") return undefined;
    try {
        const stored = localStorage.getItem("akari_user");
        if (!stored) return undefined;
        const parsed = JSON.parse(stored) as Partial<User> | null;
        if (!parsed) return undefined;
        return resolveEmpresaIdFromUser(parsed as User);
    } catch {
        return undefined;
    }
};
