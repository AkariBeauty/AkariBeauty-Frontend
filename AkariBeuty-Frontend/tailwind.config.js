// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        // Certifique-se de que o Tailwind escaneie todos os seus arquivos onde as classes são usadas
        // Inclua também os novos diretórios que você criará para o código do Bolt.new
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // SUAS CORES ORIGINAIS (prioridade em nome)
                // Se você usa classes Tailwind como 'bg-primary' ou 'text-textPrimary',
                // elas se referirão a estas definições.
                background: "#ffffff", // Fundo claro original
                "background-alt": "#e5e7eb", // Fundo claro alternativo original
                primary: "#Fd7e93", // Seu Rosa Claro original (agora é a primary padrão do Tailwind)

                textPrimary: "#000000", // Preto original
                textSecondary: "#ffffff", // Branco original
                textTertiary: "#4b5563", // Cinza claro original
                textQuaternary: "#9ca3af", // Branco (para texto) original

                // CORES DO PROJETO BOLT.NEW (renomeadas para evitar conflito com suas cores)
                // Os componentes do Bolt.new usarão estas novas chaves de cor.
                // Você precisará ajustar as classes dos componentes do Bolt.new para usar estes novos nomes.
                "bolt-primary": {
                    // A antiga 'primary' do Bolt.new, agora com prefixo
                    50: "#fdf2f8",
                    100: "#fbe8f1",
                    300: "#f5b8d2",
                    400: "#f090bb",
                    500: "#ec4899", // A principal rosa do Bolt.new
                    600: "#db2777",
                    700: "#c21e64",
                    800: "#a51c54",
                },
                "bolt-secondary": {
                    // A antiga 'secondary' do Bolt.new, agora com prefixo
                    50: "#faf5ff",
                    100: "#f5edff",
                    300: "#d7bcfa",
                    400: "#bb95f7",
                    500: "#a855f7",
                    600: "#9333ea",
                },
                "bolt-accent": {
                    // A antiga 'accent' do Bolt.new, agora com prefixo
                    400: "#f87171",
                    600: "#ef4444",
                },
                "bolt-neutral": {
                    // A antiga 'neutral' do Bolt.new, agora com prefixo
                    50: "#f9fafb",
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    400: "#9ca3af",
                    500: "#6b7280",
                    600: "#4b5563",
                    700: "#374151",
                    800: "#1f2937",
                    900: "#111827",
                },
                "bolt-green": {
                    // A antiga 'green' do Bolt.new, agora com prefixo
                    100: "#dcfce7",
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a",
                    800: "#166534",
                },
                "bolt-yellow": {
                    // A antiga 'yellow' do Bolt.new, agora com prefixo
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    700: "#b45309",
                    800: "#92400e",
                },
                "bolt-red": {
                    // A antiga 'red' do Bolt.new, agora com prefixo
                    50: "#fef2f2",
                    100: "#fee2e2",
                    700: "#b91c1c",
                    800: "#991b1b",
                },
            },
        },
        plugins: [],
    },
};
