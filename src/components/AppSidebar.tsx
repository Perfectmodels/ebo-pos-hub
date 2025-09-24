import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  Home,
  UserCheck,
  TrendingUp,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Ventes", url: "/ventes", icon: ShoppingCart },
  { title: "Stock", url: "/stock", icon: Package },
  { title: "Produits", url: "/produits", icon: BarChart3 },
  { title: "Personnel", url: "/personnel", icon: Users },
  { title: "Clients", url: "/clients", icon: UserCheck },
  { title: "Rapports", url: "/rapports", icon: TrendingUp },
  { title: "Paramètres", url: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  const collapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
  };

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary transition-colors";

  return (
    <Sidebar 
      className={`${collapsed ? "w-14" : "w-64"} bg-sidebar border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Ebo'o Gest</h2>
                <p className="text-xs text-sidebar-foreground/70">Gestion PME</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-xs">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1 text-sm text-sidebar-foreground">
                <UserCheck className="h-4 w-4" />
                {!collapsed && <span className="truncate">{user?.email}</span>}
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="text-sidebar-foreground hover:bg-sidebar-accent">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Déconnexion</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}