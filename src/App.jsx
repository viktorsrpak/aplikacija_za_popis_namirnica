import { Router, Route, A } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider.jsx";

import MainLayout from "./layouts/MainLayout.jsx";

import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router root={MainLayout}>
        <Route path="/" component={Home} />
      </Router>
    </AuthProvider>
  );
}
