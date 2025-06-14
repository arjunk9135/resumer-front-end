import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import DashboardPage from "@/pages/dashboard-page";
import ResumeAnalyzerPage from "@/pages/resume-analyzer-page";
import AnalysisQueuePage from "@/pages/analysis-queue-page";
import ResultsPage from "@/pages/results-page";
import HistoryPage from "@/pages/history-page";
import SettingsPage from "@/pages/settings-page";
import AdminPage from "@/pages/admin-panel";
import VerifyEmailPage from "@/pages/verify-email";
import { MyContextProvider } from "./hooks/use-context";

import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('PUBLISHABLE_KEY',PUBLISHABLE_KEY)

if (!PUBLISHABLE_KEY) {
  console.error('Missing Clerk Publishable Key',PUBLISHABLE_KEY);
  <div>Error: Clerk is not configured properly.</div>;
}

function Router() {
  return (
    <header>
      <SignedIn>
         <Switch>
<ProtectedRoute path="/dashboard" component={DashboardPage} />
 <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/resume-analyzer" component={ResumeAnalyzerPage} />
      <ProtectedRoute path="/analysis-queue" component={AnalysisQueuePage} />
      <ProtectedRoute path="/results/:id" component={ResultsPage} />
      <ProtectedRoute path="/results" component={ResultsPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
       <ProtectedRoute path="/admin" component={AdminPage} />
        <Route path="/login" component={AuthPage} />
        <Route path="/signup" component={AuthPage} />
        <Route path="/verify-email-address" component={VerifyEmailPage} /> {/* New route */}
         </Switch>
      </SignedIn>
    <SignedOut>
      <Switch>
      
       {/* <SignedOut> */}
        {/* <Route path="/" component={AuthPage} /> */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={AuthPage} />
        <Route path="/signup" component={AuthPage} />
        {/* </SignedOut> */}  
      <Route component={NotFound} />
    </Switch>
    </SignedOut>
    
    </header>
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
