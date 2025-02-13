import { createEffect, createSignal, Show, For } from "solid-js";
import { supabase } from "../services/supabase";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "@solidjs/router";

export default function Home() {
  const session = useAuth();
  const navigate = useNavigate();

  const [popisi, setPopisi] = createSignal([]);
  const [error, setError] = createSignal("");
  const [notifications, setNotifications] = createSignal([]);

  createEffect(async () => {
    await loadPopisi();

    if (session()) {
      showNotification("Uspješno ste se prijavili!", "success", 3000);
    }
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

  async function showNotification(message, type, trajanje) {
    const newNotification = { message, type };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== newNotification));
    }, trajanje);
  }

  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("hr-HR", options);
  }

  return (
    <>
      <Show when={notifications().length > 0}>
        <For each={notifications()}>
          {(notification) => (
            <div
              class={`alert alert-${notification.type} fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50`}
            >
              {notification.message}
            </div>
          )}
        </For>
      </Show>

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

      <Show when={!session()}>
        <div role="alert" class="alert alert-error mt-20 text-3xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Morate se prijaviti kako bi vidjeli popise!</span>
        </div>
      </Show>

      <Show when={error()}>
        <div class="bg-red-400 text-white p-2 rounded my-5">{error()}</div>
      </Show>
    </>
  );
}
