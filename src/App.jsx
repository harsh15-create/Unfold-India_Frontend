import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./pages/Chatbot";
import RoutesPage from "./pages/Routes";
import Translator from "./pages/Translator";
import MyChats from "./pages/MyChats";
import MyProfile from "./pages/MyProfile";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const ConditionalFooter = () => {
  const location = useLocation();
  if (location.pathname === '/chatbot') return null;
  return <Footer />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <div className="pt-12 md:pt-18">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
              <Route path="/routes" element={<PrivateRoute><RoutesPage /></PrivateRoute>} />
              <Route path="/translator" element={<PrivateRoute><Translator /></PrivateRoute>} />
              <Route path="/my-chats" element={<PrivateRoute><MyChats /></PrivateRoute>} />
              <Route path="/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <ConditionalFooter />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
