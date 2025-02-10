import { createEffect, createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../services/supabase";
import { A } from "@solidjs/router";

export default function Home(props) {
    const session = useAuth();

    const [popisi, setPopisi] = createSignal(null);

    createEffect(async () => {
        if (session()) {
            const { data, error } = await supabase
                .from("popis_namirnica")
                .select()
                .eq("user_id", session().user.id);

            if (!error) {
                setPopisi(data);
            }
        }
    });

    return (
        <>
            <Show when={!session()}>
                <div class="bg-red-400 text-white text-3xl p-10 rounded">Morate se prijaviti da biste vidjeli svoje popise!</div>
            </Show>
            <Show when={session() && popisi()}>
                <For each={popisi()} fallback={<div>Nema popisa.</div>}>
                    {(item) => (
                        <div class="flex flex-col gap-2 items-end bg-blue-400 text-white p-2 rounded mb-5">
                            <div class="place-self-start text-xl">{item.naziv}</div>
                            <A href={`/popis/${item.id}`} class="bg-white text-blue-400 p-2 rounded text-sm">
                                Prikaži
                            </A>
                        </div>
                    )}
                </For>
            </Show>
        </>
    );
}
