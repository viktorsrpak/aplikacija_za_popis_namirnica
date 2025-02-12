import { createEffect, createSignal, Show, For } from "solid-js";
import { supabase } from "../services/supabase";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "@solidjs/router";

export default function Home() {
  const session = useAuth();
  const navigate = useNavigate();

  const [popisi, setPopisi] = createSignal([]);
  const [error, setError] = createSignal("");

  createEffect(async () => {
    await loadPopisi();
  });

  async function loadPopisi() {
    if (session()) {
      const { data, error } = await supabase
        .from("popis_namirnica")
        .select("*")
        .eq("user_id", session().user.id);

      if (error) {
        setError("Došlo je do pogreške pri dohvaćanju popisa.");
      } else {
        setPopisi(data);
      }
    }
  }

  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("hr-HR", options);
  }

  return (
    <>
      <Show when={session() && popisi()}>
        <For each={popisi()} fallback={<div>Nema popisa.</div>}>
          {(item, index) => (
            <div
              class={`flex items-center justify-between bg-gray-700 text-white p-5 rounded mb-2 ${
                index() === 0 ? "mt-24" : "mt-0"
              } w-full`}
            >
              <div class="flex flex-col">
                <div class="text-xl">{item.naziv}</div>
                <div>{formatDate(item.created_at)}</div>
              </div>    
              <button
                class="bg-gray-600 text-white p-2 rounded text-sm"
                onClick={() => navigate(`/namirnice/${item.id}`)}
              >
                Otvori popis
              </button>
            </div>
          )}
        </For>
      </Show>

      <Show when={error()}>
        <div class="bg-red-400 text-white p-2 rounded my-5">{error()}</div>
      </Show>
    </>
  );
}
