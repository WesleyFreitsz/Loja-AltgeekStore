"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ShoppingBag, User, MapPin, ExternalLink } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalValue: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  asaasInvoiceUrl?: string | null;
  items: OrderItem[];
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      PAID: "bg-green-500/10 text-green-600 border-green-500/20",
      CANCELLED: "bg-error/10 text-error border-error/20",
      REFUNDED: "bg-outline/10 text-outline border-outline/20",
    };
    return styles[status] || styles.PENDING;
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-black text-on-background">Pedidos</h1>
        <p className="text-on-surface-variant italic">Acompanhe e gerencie as vendas da sua loja.</p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou ID do pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-4">
          {loading && orders.length === 0 ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>
          ) : filteredOrders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant hover:border-primary/30 transition-all flex flex-col gap-6 group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-outline-variant/30">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-primary uppercase tracking-tighter">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-xs text-outline font-bold mt-1">
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-outline font-bold uppercase tracking-widest">Valor Total</span>
                    <span className="font-black text-xl text-on-background">R$ {order.totalValue.toFixed(2)}</span>
                  </div>
                  {order.asaasInvoiceUrl && (
                    <a href={order.asaasInvoiceUrl} target="_blank" className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-on-primary transition-all">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Cliente
                  </h4>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-background">{order.customerName}</span>
                    <span className="text-xs text-on-surface-variant">{order.customerEmail}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag size={14} /> Itens ({order.items.length})
                  </h4>
                  <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-on-surface-variant truncate w-40">{item.quantity}x {item.name}</span>
                        <span className="font-bold text-on-background">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> Pagamento
                  </h4>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-background">{order.paymentMethod}</span>
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest">Metodo selecionado</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
