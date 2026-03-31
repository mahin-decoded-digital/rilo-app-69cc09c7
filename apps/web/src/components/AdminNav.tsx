import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Shield,
  ArrowLeft
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
];

interface AdminNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function AdminNav({ className, ...props }: AdminNavProps) {
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col border-r bg-muted/20 pb-4 h-full min-h-screen", className)} {...props}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Shield className="h-6 w-6 text-primary" />
          <span>Admin Portal</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <div className="grid items-start px-2 text-sm font-medium lg:px-4">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-auto px-4 lg:px-6 space-y-4">
        <Separator />
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Button>
      </div>
    </nav>
  );
}