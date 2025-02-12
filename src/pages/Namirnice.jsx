import { createSignal, onMount, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";

export default function Namirnice(props) {
  const params = useParams();
  const navigate = useNavigate();
  const session = useAuth();

  const [popis, setPopis] = createSignal(null);
  const [namirnice, setNamirnice] = createSignal([]);
  const [isOwner, setOwner] = createSignal(false);

  onMount(async () => {
    const { data, error } = await supabase
      .from("popis_namirnica")
      .select()
      .eq("id", params.id);
    if (error) return;
    setPopis(data[0]);

    if (session().user.id === data[0].user_id) setOwner(true);

    await loadNamirnice();
  });

  async function loadNamirnice() {
    const { data, error } = await supabase
      .from("namirnice")
      .select()
      .eq("popis_id", popis().id);
    if (error) return;
    setNamirnice(data);
  }

  async function addNamirnica(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const naziv = formData.get("naziv");
    const kolicina = formData.get("kolicina");

    const { error } = await supabase.from("namirnice").insert({
      naziv: naziv,
      kolicina: parseInt(kolicina),
      kupljeno: false,
      popis_id: popis().id,
    });

    if (error) {
      alert("Dodavanje namirnice nije uspjelo.");
    } else {
      await loadNamirnice();
      event.target.reset();
    }
  }

  async function deletePopis() {
    if (
      confirm(
        "Jeste li sigurni da želite obrisati cijeli popis i sve namirnice?"
      )
    ) {
      const { error } = await supabase
        .from("namirnice")
        .delete()
        .eq("popis_id", popis().id);

      if (error) {
        alert("Došlo je do pogreške pri brisanju namirnica.");
      } else {
        const { error: popisError } = await supabase
          .from("popis_namirnica")
          .delete()
          .eq("id", popis().id);

        if (popisError) {
          alert("Došlo je do pogreške pri brisanju popisa.");
        } else {
          alert("Popis i namirnice uspješno obrisani.");
          navigate("/");
        }
      }
    }
  }

  async function deleteNamirnica(namirnicaId) {
    if (confirm("Jeste li sigurni da želite obrisati ovu namirnicu?")) {
      const { error } = await supabase
        .from("namirnice")
        .delete()
        .eq("id", namirnicaId);

      if (error) {
        alert("Došlo je do pogreške pri brisanju namirnice.");
      } else {
        await loadNamirnice();
        alert("Namirnica uspješno obrisana.");
      }
    }
  }

  return (
    <>
      <Show when={popis()}>
        <div class="text-6xl font-bold text-gray-400 mb-25 mt-10 text-center uppercase">
          Popis - {popis().naziv}
        </div>

        <Show when={isOwner()}>
          <div class="mt-2 mb-8">
            <button
              onClick={deletePopis}
              class="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Obriši cijeli popis
            </button>
          </div>
        </Show>

        <Show when={isOwner()}>
          <form onSubmit={addNamirnica} class="space-y-4">
            <div class="flex flex-col">
              <label class="text-sm font-semibold mb-2">Namirnica:</label>
              <input
                type="text"
                name="naziv"
                required
                class="input input-bordered w-full rounded-md py-2 px-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-semibold mb-2">Količina:</label>
              <input
                type="number"
                name="kolicina"
                required
                class="input input-bordered w-full rounded-md py-2 px-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-center">
              <input
                type="submit"
                value="Dodaj namirnicu"
                class="bg-blue-500 text-white py-2 px-6 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </Show>

        <div>
          <h2 class="font-bold text-xl text-white mt-8 mb-4">Namirnice:</h2>
          <For
            each={namirnice()}
            fallback={<div class="text-white">Nema namirnica u popisu.</div>}
          >
            {(item) => (
              <div class="flex justify-between items-center bg-gray-600 p-4 rounded-lg shadow-md mb-3">
                <div class="text-lg text-white">
                  Namirnica: {item.naziv} <br />
                  Količina: {item.kolicina}
                </div>
                <div class="flex items-center space-x-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-sm">
                        Označi kao kupljeno
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked={item.kupljeno}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                  <button
                    class="bg-red-500 text-white py-1 px-3 rounded-full text-sm hover:bg-red-600 focus:outline-none"
                    onClick={() => deleteNamirnica(item.id)}
                  >
                    Briši
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={!popis()}>
        <div class="text-lg text-red-500">Popis ne postoji!</div>
      </Show>
    </>
  );
}
