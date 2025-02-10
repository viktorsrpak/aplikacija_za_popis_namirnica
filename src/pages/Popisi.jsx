import { createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Popisi() {
  const session = useAuth();

  const [success, setSuccess] = createSignal(false);
  const [error, setError] = createSignal('');
  const [nazivPopisa, setNazivPopisa] = createSignal('');

  
  async function formSubmit(event) {
    setSuccess(false);
    setError('');
    event.preventDefault();

    const naziv = nazivPopisa();
    const user_id = session().user.id;

    if (!naziv) {
      setError('Naziv popisa ne smije biti prazan.');
      return;
    }

    const { error } = await supabase
      .from("popis_namirnica")
      .insert({
        naziv: naziv,
        user_id: user_id
      });

    if (error) {
      setError('Došlo je do pogreške prilikom spremanja popisa.');
    } else {
      setSuccess(true);
      setNazivPopisa(''); 
    }
  }

  return (
    <>
      <Show when={success()}>
        <div class="bg-green-400 text-white p-2 rounded my-5">
          Popis uspješno kreiran!
        </div>
      </Show>

      <Show when={error()}>
        <div class="bg-red-400 text-white p-2 rounded my-5">
          {error()}
        </div>
      </Show>

      <form onSubmit={formSubmit}>
        <div class="p-2 flex flex-col gap-1">
          <label>Naziv popisa:</label>
          <input
            type="text" 
            naziv="naziv"
            value={nazivPopisa()}
            onInput={(e) => setNazivPopisa(e.target.value)}
            required
            class="p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div class="p-2 flex flex-col gap-1">
          <input
            type="submit"
            value="Kreiraj popis"
            class="bg-blue-500 text-white p-2 rounded"
          />
        </div>
      </form>
    </>
  );
}
