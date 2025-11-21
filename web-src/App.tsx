import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import SmartSense from "./pages/SmartSense";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Wallets from "./pages/Wallets";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import HelpSupport from "./pages/HelpSupport";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="expense-track-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<><Dashboard /><BottomNav /></>} />
          <Route path="/add-expense" element={<><AddExpense /><BottomNav /></>} />
          <Route path="/smart-sense" element={<><SmartSense /><BottomNav /></>} />
          <Route path="/analytics" element={<><Analytics /><BottomNav /></>} />
          <Route path="/transactions" element={<><Transactions /><BottomNav /></>} />
          <Route path="/budget" element={<><Budget /><BottomNav /></>} />
          <Route path="/wallets" element={<><Wallets /><BottomNav /></>} />
          <Route path="/settings" element={<><Settings /><BottomNav /></>} />
          <Route path="/profile" element={<><Profile /><BottomNav /></>} />
          <Route path="/notifications" element={<><Notifications /><BottomNav /></>} />
          <Route path="/security" element={<><Security /><BottomNav /></>} />
          <Route path="/help-support" element={<><HelpSupport /><BottomNav /></>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
