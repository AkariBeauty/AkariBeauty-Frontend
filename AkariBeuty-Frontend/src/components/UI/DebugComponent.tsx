

export default function DebugComponent() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">DEBUG - APLICAÇÃO FUNCIONANDO!</h1>
        <p className="text-xl">Se você está vendo esta tela, a aplicação está funcionando!</p>
        <p className="text-lg mt-2">Cor: Vermelho (bg-red-500)</p>
      </div>
    </div>
  );
}

