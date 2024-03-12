import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/providers/themeProvider";
import MudaeNavBar from "@/components/mudae_ui/mudae_navbar/Mudae_navBar";
import MudaePage from "@/components/mudae_ui/mudae_cards/Mudae_Page";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <main className="flex flex-col lg:flex-row">
          <nav className="flex flex-row h-max justify-start lg:sticky top-0">
            <MudaeNavBar />
          </nav>

          <section className="flex-grow py-2">
            <MudaePage />
          </section>
        </main>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
