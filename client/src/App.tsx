import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ResumeAnalyzerPage from "@/pages/resume-analyzer-page";
import AnalysisQueuePage from "@/pages/analysis-queue-page";
import ResultsPage from "@/pages/results-page";
import HistoryPage from "@/pages/history-page";
import { MyContextProvider } from "./hooks/use-context";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/resume-analyzer" component={ResumeAnalyzerPage} />
      <ProtectedRoute path="/analysis-queue" component={AnalysisQueuePage} />
      <ProtectedRoute path="/results/:id" component={ResultsPage} />
      <ProtectedRoute path="/results" component={ResultsPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MyContextProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
        </MyContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
