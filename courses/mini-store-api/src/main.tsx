import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import App from "./App.tsx";
import { AuthProvider } from "./context/index.tsx";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class">
        <App />
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
