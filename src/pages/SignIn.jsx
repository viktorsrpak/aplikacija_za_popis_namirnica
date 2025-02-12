import { createSignal } from "solid-js";
import { supabase } from "../services/supabase";
import { useNavigate } from "@solidjs/router";

export default function SignIn(props) {
    const navigate = useNavigate();
    const [result, setResult] = createSignal(null);

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        console.log(result);
        if (result.error) {
            setResult("Dogodila se greška prilikom prijave!");
        } else {
            setResult("Prijava je uspjela.");
            navigate("/", { replace: true });
        }
    }

    return (
        <>
            <Show when={result()}>
                <div class="bg-red-500 text-white p-4 rounded mb-4">
                    {result()}
                </div>
            </Show>

            <div class="flex justify-center items-center min-h-screen">
                <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 class="text-2xl font-bold text-center text-white mb-6">Prijava</h2>

                    <form onSubmit={formSubmit} class="space-y-4">
                        <div class="flex flex-col">
                            <label for="email" class="text-sm font-medium text-gray-300">E-mail adresa:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                class="border border-gray-600 bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div class="flex flex-col">
                            <label for="password" class="text-sm font-medium text-gray-300">Zaporka:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength="6"
                                class="border border-gray-600 bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div class="flex flex-col">
                            <input
                                type="submit"
                                value="Prijava"
                                class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
