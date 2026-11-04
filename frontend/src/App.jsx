
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Storefront from "./pages/Storefront";
import Settings from "./pages/Settings";

function App() {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="min-w-0 flex-1">
        <Header title={activePage} />

        <div className="p-8">
          {activePage === "Overview" ? (
            <Dashboard />
          ) : activePage === "Products" ? (
            <Products />
          ) : activePage === "Analytics" ? (
            <Analytics />
          ) : activePage === "Storefront" ? (
            <Storefront />
          ) : activePage === "Settings" ? (
            <Settings />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                {activePage}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Section not found.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
