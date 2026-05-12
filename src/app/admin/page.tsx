"use client";

import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  Ticket,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalSales: number;
  activeOrders: number;
  totalProducts: number;
  activeCoupons: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  totalValue: number;
  paymentMethod: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await fetch("/api/admin/stats");
        if (!statsRes.ok) throw new Error("Erro ao carregar estatísticas");
        
        const data = await statsRes.json();

        setStats({
          totalSales: data.totalSales,
          activeOrders: data.activeOrders,
          totalProducts: data.totalProducts,
          activeCoupons: data.activeCoupons
        });

        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { name: "Total de Vendas", value: stats ? `R$ ${stats.totalSales.toFixed(2)}` : "...", icon: TrendingUp, color: "bg-green-500/10 text-green-500" },
    { name: "Pedidos Pendentes", value: stats ? stats.activeOrders.toString() : "...", icon: ShoppingBag, color: "bg-blue-500/10 text-blue-500" },
    { name: "Produtos Cadastrados", value: stats ? stats.totalProducts.toString() : "...", icon: Package, color: "bg-purple-500/10 text-purple-500" },
    { name: "Cupons Ativos", value: stats ? stats.activeCoupons.toString() : "...", icon: Ticket, color: "bg-orange-500/10 text-orange-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-black text-on-background">Olá, Administrador!</h1>
        <p className="text-on-surface-variant italic">Aqui está o que está acontecendo na sua loja hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-outline uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-2xl font-black text-on-background">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Ultimos Pedidos */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-on-background">Últimos Pedidos</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentOrders.length === 0 ? (
              <p className="text-center text-outline py-8 italic">Nenhum pedido encontrado.</p>
            ) : recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline text-[10px] font-bold">
                    ID
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-background truncate w-32">{order.customerName}</span>
                    <span className="text-xs text-outline">R$ {order.totalValue.toFixed(2)} • {order.paymentMethod}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                  order.status === "PAID" 
                    ? "bg-green-500/10 text-green-600 border-green-500/20" 
                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col gap-6">
          <h2 className="font-display text-xl font-bold text-on-background">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products" className="flex flex-col items-center justify-center p-6 bg-primary/5 hover:bg-primary/10 rounded-[2rem] border border-primary/20 transition-all group gap-3">
              <Package size={32} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-primary text-sm text-center">Gerenciar Produtos</span>
            </Link>
            <Link href="/admin/banners" className="flex flex-col items-center justify-center p-6 bg-purple-500/5 hover:bg-purple-500/10 rounded-[2rem] border border-purple-500/20 transition-all group gap-3">
              <ImageIcon size={32} className="text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-purple-500 text-sm text-center">Mudar Banners</span>
            </Link>
            <Link href="/admin/coupons" className="flex flex-col items-center justify-center p-6 bg-orange-500/5 hover:bg-orange-500/10 rounded-[2rem] border border-orange-500/20 transition-all group gap-3">
              <Ticket size={32} className="text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-orange-500 text-sm text-center">Criar Cupons</span>
            </Link>
            <Link href="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-blue-500/5 hover:bg-blue-500/10 rounded-[2rem] border border-blue-500/20 transition-all group gap-3">
              <ShoppingBag size={32} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-blue-500 text-sm text-center">Ver Pedidos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

