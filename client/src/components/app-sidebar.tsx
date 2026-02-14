import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Building2,
  CreditCard,
  BarChart3,
  TrendingUp,
  LogOut,
  Globe,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { roleLabels } from "@/lib/data";

const mainNav = [
  { href: "/admin", label: "Хянах самбар", icon: LayoutDashboard, testId: "dashboard" },
  { href: "/admin/members", label: "Гишүүд", icon: Users, testId: "members" },
  { href: "/admin/trainers", label: "Дасгалжуулагч", icon: Dumbbell, testId: "trainers" },
  { href: "/admin/branches", label: "Салбарууд", icon: Building2, testId: "branches" },
];

const financeNav = [
  { href: "/admin/payments", label: "Төлбөр", icon: CreditCard, testId: "payments" },
  { href: "/admin/analytics", label: "Аналитик", icon: BarChart3, testId: "analytics" },
  { href: "/admin/investor", label: "Хөрөнгө оруулагч", icon: TrendingUp, testId: "investor" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/admin">
          <div className="flex items-center gap-3 cursor-pointer" data-testid="sidebar-logo">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">
                Vegete Gym
              </h1>
              <p className="text-xs text-muted-foreground">Удирдлагын систем</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Үндсэн</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`sidebar-nav-${item.testId}`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Санхүү & Тайлан</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.href}
                    data-testid={`sidebar-nav-${item.testId}`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="sidebar-nav-website">
                  <Link href="/">
                    <Globe className="w-4 h-4" />
                    <span>Вебсайт үзэх</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {user?.fullName?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.fullName || "Админ"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {roleLabels[user?.role || "super_admin"]}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-md text-muted-foreground hover-elevate"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
