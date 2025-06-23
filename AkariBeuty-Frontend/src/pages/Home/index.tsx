import { useState } from 'react';

export default function Home() {
    const [trocar, setTrocar] = useState(false);

    return (
    <div className="relative w-[200px] h-[100px]">
        <div
        className={`absolute w-20 h-20 bg-red-500 transition-transform duration-500 ${
            trocar ? 'translate-x-[100px]' : 'translate-x-0'
        }`}
        />
        <div
        className={`absolute w-20 h-20 bg-blue-500 transition-transform duration-500 ${
            trocar ? 'translate-x-0' : 'translate-x-[100px]'
        }`}
        />
        <button
        onClick={() => setTrocar(!trocar)}
        className="absolute top-[90px] left-0 bg-black text-white px-2 rounded"
        >
        Trocar
        </button>
    </div>
    );
}
