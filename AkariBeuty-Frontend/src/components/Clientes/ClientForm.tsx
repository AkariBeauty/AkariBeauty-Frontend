import { useEffect, useState } from "react";
import  {Cliente}  from "../../services/clientCrudService";


type CreateUpdate = Omit<Cliente, "id">;

type Props = {
  initial?: Cliente | null;
  onSubmit: (payload: CreateUpdate) => Promise<void>;
};

export default function ClientForm({ initial, onSubmit }: Props) {
  const [form, setForm] = useState<CreateUpdate>({
    nome: "", cpf: "", uf: "", cidade: "", bairro: "",
    rua: "", numero: 0, login: "", senha: "", telefone: ""
  });

  useEffect(() => {
    if (initial) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = initial;
      setForm({ ...rest });
    }
  }, [initial]);

  function set<K extends keyof CreateUpdate>(k: K, v: CreateUpdate[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => { e.preventDefault(); await onSubmit(form); }}
    >
      <div className="grid md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Nome*" required
          value={form.nome} onChange={e=>set("nome", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="CPF"
          value={form.cpf} onChange={e=>set("cpf", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Telefone"
          value={form.telefone} onChange={e=>set("telefone", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="UF"
          value={form.uf} onChange={e=>set("uf", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Cidade"
          value={form.cidade} onChange={e=>set("cidade", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Bairro"
          value={form.bairro} onChange={e=>set("bairro", e.target.value)} />
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Rua"
          value={form.rua} onChange={e=>set("rua", e.target.value)} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Número"
          value={form.numero} onChange={e=>set("numero", Number(e.target.value))} />
        <input className="border rounded px-3 py-2" placeholder="Login"
          value={form.login} onChange={e=>set("login", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Senha"
          value={form.senha} onChange={e=>set("senha", e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Salvar</button>
      </div>
    </form>
  );
}
