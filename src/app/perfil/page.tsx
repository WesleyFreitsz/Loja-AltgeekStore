"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, User as UserIcon, LogOut, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setFetchingOrders(true);
      // Fetch orders from API
      fetch(`/api/orders?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
          setFetchingOrders(false);
        })
        .catch(err => {
          console.error(err);
          setFetchingOrders(false);
        });
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PAID": return { label: "Pago", color: "text-tertiary bg-tertiary/10", icon: <CheckCircle2 className="w-4 h-4" /> };
      case "CANCELLED": return { label: "Cancelado", color: "text-error bg-error/10", icon: <XCircle className="w-4 h-4" /> };
      case "EXPIRED": return { label: "Expirado", color: "text-outline bg-outline/10", icon: <Clock className="w-4 h-4" /> };
      default: return { label: "Pendente", color: "text-secondary bg-secondary/10", icon: <Clock className="w-4 h-4" /> };
    }
  };

  if (isLoading || !user) return null;

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-surface-container-lowest shadow-lg">
              <UserIcon className="w-12 h-12" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-xl font-bold">{user.name}</h2>
              <p className="text-xs text-on-surface-variant italic">{user.email}</p>
            </div>
          </div>

          <nav className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-4 px-6 py-4 bg-secondary/10 text-secondary font-bold">
              <Package className="w-5 h-5" /> Meus Pedidos
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors text-on-surface-variant font-medium border-t border-outline-variant">
              <UserIcon className="w-5 h-5" /> Meus Dados
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-error/10 text-error transition-colors font-bold border-t border-outline-variant"
            >
              <LogOut className="w-5 h-5" /> Sair
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-extrabold text-on-background">Histórico de Pedidos</h1>
            <p className="text-on-surface-variant italic">Acompanhe o status e detalhes de todas as suas compras.</p>
          </div>

          {fetchingOrders ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
              <p className="font-bold text-outline">Carregando seus pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-surface-container-low p-12 rounded-[3rem] border-2 border-dashed border-outline-variant flex flex-col items-center gap-6 text-center">
              <div className="bg-outline/10 p-6 rounded-full text-outline">
                <Package className="w-12 h-12" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-bold text-on-surface">Nenhum pedido encontrado</h3>
                <p className="text-sm text-on-surface-variant max-w-xs">Parece que você ainda não fez nenhuma compra. Que tal explorar nossa loja?</p>
              </div>
              <Link href="/" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                Ir para a Loja
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                  <div key={order.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-outline uppercase tracking-widest">#{order.id.slice(-6)}</span>
                        <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.color)}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>
                      <h4 className="font-display font-bold text-lg">
                        {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-display text-2xl font-extrabold text-on-background">
                        R$ {order.totalValue.toFixed(2).replace(".", ",")}
                      </span>
                      <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4">
                        Ver Detalhes <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
