import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut.jsx";
import { A } from "@solidjs/router";
import Popisi from "./pages/Popisi";
import Namirnice from "./pages/Namirnice";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/popisi" component={Popisi} />
        <Route path="/namirnice/:id" component={Namirnice} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;
  const session = useAuth();

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <div>
        <div class="flex items-center">
          <div className="text-4xl text-white-500 uppercase font-bold">
            {appName}
          </div>

          <div class="ml-auto flex gap-2">
            <A href="/" class="bg-green-700 p-2 rounded hover:bg-green-500">
              Naslovnica
            </A>

            <Show when={session()}>
              <A
                href="/popisi"
                class="bg-cyan-800 p-2 rounded hover:bg-cyan-400"
              >
                Novi popis
              </A>
            </Show>

            

            <Show when={!session()}>
              <A href="/signin" class="bg-sky-700 p-2 rounded hover:bg-sky-500">
                Prijava
              </A>
            </Show>
            <Show when={session()}>
              <A
                href="/signout"
                class="bg-red-500 p-2 rounded hover:bg-red-400"
              >
                Odjava
              </A>
            </Show>
          </div>
        </div>
      </div>

      <div className="min-h-[75vh] w-10/12 mx-auto">{props.children}</div>
      <div className="text-center text-xs">
        Sva prava pridržana {new Date().getFullYear()}.
      </div>
    </div>
  );
}
