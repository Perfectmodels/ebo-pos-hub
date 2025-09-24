import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Ventes from "./pages/Ventes";
import Stock from "./pages/Stock";
import Personnel from "./pages/Personnel";
import Rapports from "./pages/Rapports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-bg">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              {/* Header with Trigger */}
              <header className="h-14 flex items-center border-b border-border bg-card px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">Ebo'o Gest - Gestion PME</h2>
                </div>
              </header>
              
              {/* Main Content */}
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/ventes" element={<Ventes />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/personnel" element={<Personnel />} />
                  <Route path="/rapports" element={<Rapports />} />
                  <Route path="/produits" element={<div className="p-6"><h1 className="text-3xl font-bold">Produits & Services - En développement</h1></div>} />
                  <Route path="/clients" element={<div className="p-6"><h1 className="text-3xl font-bold">Gestion Clients - En développement</h1></div>} />
                  <Route path="/parametres" element={<div className="p-6"><h1 className="text-3xl font-bold">Paramètres - En développement</h1></div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
