import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Home() {
    const { toggleTheme } = useContext(ThemeContext);

    function handleThemeChange() {
        toggleTheme();
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="bg-primary text-white p-4 rounded">Home Page</h1>
            <p className="bg-green-500 text-white p-2 rounded">Welcome to the home page!</p>
            <button
                className="bg-blue-500 text-white p-2 rounded mt-4"
                onClick={handleThemeChange}
                >
                Toggle Theme
            </button>
        </div>
    );
}
