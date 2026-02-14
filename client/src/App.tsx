import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import MembersPage from "@/pages/members";
import TrainersPage from "@/pages/trainers";
import BranchesPage from "@/pages/branches";
import PaymentsPage from "@/pages/payments";
import AnalyticsPage from "@/pages/analytics";
import InvestorPage from "@/pages/investor";
import HomePage from "@/pages/public/home";
import LocationsPage from "@/pages/public/locations";
import CoursesPage from "@/pages/public/courses";
import CoachesPage from "@/pages/public/coaches";
import ContactPage from "@/pages/public/contact";
import NotFound from "@/pages/not-found";

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={DashboardPage} />
      <Route path="/admin/members" component={MembersPage} />
      <Route path="/admin/trainers" component={TrainersPage} />
      <Route path="/admin/branches" component={BranchesPage} />
      <Route path="/admin/payments" component={PaymentsPage} />
      <Route path="/admin/analytics" component={AnalyticsPage} />
      <Route path="/admin/investor" component={InvestorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-2 p-3 border-b sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              Vegete Gym - Удирдлагын систем
            </span>
          </header>
          <main className="flex-1 overflow-auto">
            <AdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/locations" component={LocationsPage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/coaches" component={CoachesPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
      <PublicFooter />
    </>
  );
}

function AppRouter() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <AdminApp />;
  }

  return <PublicLayout />;
}

function DarkModeInit() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DarkModeInit />
          <Toaster />
          <AppRouter />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
