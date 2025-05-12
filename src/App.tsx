import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HomePage from "@/pages/HomePage"; 
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import HowToPlay from "@/pages/HowToPlay";
import LeaderboardPage from "@/pages/LeaderboardPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ResponsibleGamingPage from "@/pages/ResponsibleGamingPage";
import SupportPage from "@/pages/SupportPage";
import FaqPage from "@/pages/FaqPage";
import ProfilePage from "@/pages/ProfilePage";
import { AuthProvider } from "@/contexts/AuthContext";
import PlinkoGame from "@/components/PlinkoGame";
import DiceGame from "@/components/DiceGame";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mines-hunt" element={<Index activeGame="gems" />} />
      <Route path="/crash-game" element={<Index activeGame="crash" />} />      <Route path="/plinko-game" element={<Index activeGame="plinko" />} />
      <Route path="/dice-game" element={<Index activeGame="dice" />} />
      <Route path="/rps-game" element={<Index activeGame="rps" />} />
      <Route path="/flip-game" element={<Index activeGame="flip" />} />
      <Route path="/dragon-tower" element={<Index activeGame="dragon" />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/responsible-gaming" element={<ResponsibleGamingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/faq" element={<FaqPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
