import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdaptiveSidebar from "./components/AdaptiveSidebar";
import AdaptiveDashboard from "./components/AdaptiveDashboard";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InscriptionPME from "./pages/InscriptionPME";
import Dashboard from "./pages/Dashboard";
import Ventes from "./pages/Ventes";
import Stock from "./pages/Stock";
import Personnel from "./pages/Personnel";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
import AdminPanel from "./pages/AdminPanel";
import AuthErrorHandler from "./components/AuthErrorHandler";
import AuthCallbackHandler from "./components/AuthCallbackHandler";
import ConfirmSignup from "./pages/ConfirmSignup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ActivityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth-error" element={<AuthErrorHandler />} />
                  <Route path="/auth/callback" element={<AuthCallbackHandler />} />
                  <Route path="/confirm-signup" element={<ConfirmSignup />} />
                  <Route path="/inscription-pme" element={<InscriptionPME />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <AdaptiveDashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/ventes" element={
              <ProtectedRoute>
                <AppLayout>
                  <Ventes />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/stock" element={
              <ProtectedRoute>
                <AppLayout>
                  <Stock />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/personnel" element={
              <ProtectedRoute>
                <AppLayout>
                  <Personnel />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/rapports" element={
              <ProtectedRoute>
                <AppLayout>
                  <Rapports />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/produits" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="p-6"><h1 className="text-3xl font-bold">Produits & Services - En développement</h1></div>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="p-6"><h1 className="text-3xl font-bold">Gestion Clients - En développement</h1></div>
                </AppLayout>
              </ProtectedRoute>
            } />
                  <Route path="/parametres" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Parametres />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AdminPanel />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ActivityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// App Layout for authenticated pages
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-gradient-bg">
      <AdaptiveSidebar />
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
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default App;
