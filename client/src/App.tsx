import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Statistics from "@/pages/Statistics";
import Profile from "@/pages/Profile";
import CategorySettings from "@/pages/CategorySettings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <Landing />}
      </Route>
      <Route path="/statistics" component={Statistics} />
      <Route path="/profile" component={Profile} />
      <Route path="/categories" component={CategorySettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CategoryProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Router />
            </main>
          </div>
          <Toaster />
        </CategoryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
