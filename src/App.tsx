import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import RiskPool from "./pages/dashboard/RiskPool";
import Claims from "./pages/dashboard/Claims";
import Governance from "./pages/dashboard/Governance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout><RiskPool /></DashboardLayout>} />
            <Route path="/dashboard/risk-pool" element={<DashboardLayout><RiskPool /></DashboardLayout>} />
            <Route path="/dashboard/claims" element={<DashboardLayout><Claims /></DashboardLayout>} />
            <Route path="/dashboard/governance" element={<DashboardLayout><Governance /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
