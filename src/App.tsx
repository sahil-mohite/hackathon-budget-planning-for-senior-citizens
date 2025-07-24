import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignupStep1 from "./pages/auth/SignUpFirstPage";
import SignupStep2 from "./pages/auth/SignUpSecondPage"
import Login from "./pages/auth/SignIn";
import { SignupProvider } from "@/context/SignupContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
          
          <Route
            path="/signup-step-one"
            element={
              <SignupProvider>
                <SignupStep1 />
              </SignupProvider>
            }
          />
          <Route
            path="/signup-step-two"
            element={
              <SignupProvider>
                <SignupStep2 />
              </SignupProvider>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
