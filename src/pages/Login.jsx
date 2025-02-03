import { createSignal } from "solid-js";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
    const { session, signIn, signUp, signOut } = useAuth();
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    return (
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {session() ? (
                <div>
                    <p>Prijavljeni ste kao: {session().user.email}</p>
                    <button class="btn btn-primary" onClick={signOut}>Odjavi se</button>
                </div>
            ) : (
                <div class="p-6 bg-white shadow-lg rounded-lg">
                    <h2 class="text-lg font-bold mb-4">Prijava</h2>
                    <input type="email" placeholder="Email" class="input input-bordered w-full mb-2"
                        onInput={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Lozinka" class="input input-bordered w-full mb-4"
                        onInput={(e) => setPassword(e.target.value)} />
                    <button class="btn btn-primary w-full mb-2" onClick={() => signIn(email(), password())}>
                        Prijavi se
                    </button>
                    <button class="btn btn-secondary w-full" onClick={() => signUp(email(), password())}>
                        Registriraj se
                    </button>
                </div>
            )}
        </div>
    );
}
