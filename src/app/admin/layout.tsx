"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Ticket, 
  Image as ImageIcon, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon
} from "lucide-react";
import { clsx } from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produtos", href: "/admin/products", icon: Package },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Cupons", href: "/admin/coupons", icon: Ticket },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest flex">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-surface-container-low border-r border-outline-variant transition-all duration-300 flex flex-col fixed h-full z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={clsx("font-display font-black text-primary transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
            ALT<span className="text-on-background">GEEK</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-outline">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all group"
            >
              <item.icon size={24} className="min-w-[24px]" />
              <span className={clsx("font-label font-bold transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <UserIcon size={20} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-background truncate w-32">{user.name}</span>
                <span className="text-xs text-outline">Administrador</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-error/10 text-error transition-all group w-full"
          >
            <LogOut size={24} className="min-w-[24px]" />
            <span className={clsx("font-label font-bold transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={clsx(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-8 justify-between">
          <h2 className="font-display text-xl font-bold text-on-background">Painel Administrativo</h2>
          <div className="flex items-center gap-4">
             {/* Notificações ou outros controles podem ir aqui */}
          </div>
        </header>

        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
