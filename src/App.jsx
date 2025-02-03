import { Router, Route } from "@solidjs/router";
import { A } from "@solidjs/router";
import { AuthProvider } from "./components/AuthProvider";
import { Show } from "solid-js";
import Dashboard from "./pages/Home";

function Home() {
  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 class="text-4xl font-bold text-blue-600">Dobrodošli!</h1>
      <p class="mt-4 text-lg text-gray-700">Ovo je početna stranica vaše aplikacije.</p>
      <A href="/dashboard" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
        Idi na Dashboard
      </A>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
      </Router>
    </AuthProvider>
  );
}