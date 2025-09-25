
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PWAInstaller from "@/components/PWAInstaller";
import "@/config/console"; // Configuration console
import { ActivityProvider } from "./contexts/ActivityContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MultiUserProvider } from "./contexts/MultiUserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdaptiveSidebar from "./components/AdaptiveSidebar";
import AdaptiveDashboard from "./components/AdaptiveDashboard";
import Home from "./pages/HomeNew";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Ventes from "./pages/Ventes";
import StockNew from "./pages/StockNew";
import Personnel from "./pages/Personnel";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Parametres";
import Produits from "./pages/Produits";
import Clients from "./pages/Clients";
import AdminPanel from "./pages/AdminPanelCMS";
import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import Guide from "./pages/Guide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import DataProtection from "./components/DataProtection";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <DataProtection>
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <ActivityProvider>
                <MultiUserProvider>
                  <TooltipProvider>
                <Toaster />
                <Sonner />
                <PWAInstaller />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                  }}
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

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
                          <StockNew />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <StockNew />
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
                          <Produits />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Clients />
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
                    <Route path="/admin" element={<AdminPanel />} />

                    {/* Catch all - 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                  </TooltipProvider>
                </MultiUserProvider>
              </ActivityProvider>
            </ThemeProvider>
          </AuthProvider>
      </QueryClientProvider>
    </DataProtection>
  </ErrorBoundary>
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
