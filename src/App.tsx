
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } 
    />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
    <Route 
      path="/projects/create" 
      element={
        <ProtectedRoute>
          <CreateProject />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/messages" 
      element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin" 
      element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } 
    />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
