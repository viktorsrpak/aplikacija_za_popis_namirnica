import { createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";
import { useParams } from "@solidjs/router";

export default function Namirnice() {
  const session = useAuth();
  const params = useParams();
  const popisId = params.id;

  const [success, setSuccess] = createSignal(false);
  const [error, setError] = createSignal('');
  const [nazivNamirnice, setNazivNamirnice] = createSignal('');
  const [kolicina, setKolicina] = createSignal('');

  // Funkcija za slanje obrasca
  async function formSubmit(event) {
    setSuccess(false);
    setError('');
    event.preventDefault();

    const naziv = nazivNamirnice();
    const kolicinaValue = kolicina();
    const user_id = session().user.id;

    if (!naziv || !kolicinaValue) {
      setError('Sva polja moraju biti ispunjena.');
      return;
    }

    const { error } = await supabase
      .from("namirnice")
      .insert({
        naziv: naziv,
        kolicina: kolicinaValue,
        popis_id: popisId,
        user_id: user_id
      });

    if (error) {
      setError('Došlo je do pogreške prilikom spremanja namirnice.');
    } else {
      setSuccess(true);
      setNazivNamirnice('');
      setKolicina('');
    }
  }

  return (
    <>
      <Show when={success()}>
        <div class="bg-green-400 text-white p-2 rounded my-5">
          Namirnica uspješno dodana!
        </div>
      </Show>

      <Show when={error()}>
        <div class="bg-red-400 text-white p-2 rounded my-5">
          {error()}
        </div>
      </Show>

      <form onSubmit={formSubmit}>
        <div class="p-2 flex flex-col gap-1">
          <label>Naziv namirnice:</label>
          <input
            type="text"
            value={nazivNamirnice()}
            onInput={(e) => setNazivNamirnice(e.target.value)}
            required
            class="p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div class="p-2 flex flex-col gap-1">
          <label>Količina:</label>
          <input
            type="number"
            value={kolicina()}
            onInput={(e) => setKolicina(e.target.value)}
            required
            class="p-2 w-full border border-gray-300 rounded"
          />
        </div>

        <div class="p-2 flex flex-col gap-1">
          <input
            type="submit"
            value="Dodaj namirnicu"
            class="bg-blue-500 text-white p-2 rounded"
          />
        </div>
      </form>
    </>
  );
}
