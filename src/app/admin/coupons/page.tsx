"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Ticket, Calendar } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  value: number;
  minPurchase: number;
  active: boolean;
  expiresAt?: string | null;
}

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    value: 0,
    minPurchase: 0,
    active: true,
    expiresAt: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/coupons");
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon: Coupon | null = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        minPurchase: coupon.minPurchase,
        active: coupon.active,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : ""
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountType: "PERCENTAGE",
        value: 0,
        minPurchase: 0,
        active: true,
        expiresAt: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : "/api/admin/coupons";
    const method = editingCoupon ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt || null
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este cupom?")) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-on-background">Cupons de Desconto</h1>
          <p className="text-on-surface-variant italic">Crie e gerencie códigos promocionais para seus clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Novo Cupom
        </button>
      </div>

      <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Código</th>
              <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Valor</th>
              <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Expiração</th>
              <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && coupons.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></td></tr>
            ) : coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Ticket size={18} className="text-primary" />
                    <span className="font-black text-primary tracking-tighter uppercase">{coupon.code}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs font-bold text-on-surface-variant">{coupon.discountType}</td>
                <td className="py-4 px-4 font-bold text-on-background">
                  {coupon.discountType === "PERCENTAGE" ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}
                </td>
                <td className="py-4 px-4">
                  {coupon.expiresAt ? (
                    <div className="flex items-center gap-2 text-xs text-outline">
                      <Calendar size={14} /> {new Date(coupon.expiresAt).toLocaleDateString("pt-BR")}
                    </div>
                  ) : (
                    <span className="text-xs text-outline italic">Nunca expira</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(coupon)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(coupon.id)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-[3rem] shadow-2xl border border-outline-variant flex flex-col overflow-hidden">
             <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-display text-2xl font-black text-on-background">{editingCoupon ? "Editar Cupom" : "Novo Cupom"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Código do Cupom</label>
                <input required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="EX: GEEK20" className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none uppercase font-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Tipo</label>
                  <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none">
                    <option value="PERCENTAGE">Porcentagem (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Valor</label>
                  <input required type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({...formData, value: Number(e.target.value)})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Compra Mínima</label>
                  <input type="number" step="0.01" value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: Number(e.target.value)})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Expira em</label>
                  <input type="date" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
               <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-primary" />
                  <label htmlFor="active" className="text-sm font-bold text-on-background">Cupom Ativo</label>
                </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary font-display text-lg font-bold py-4 rounded-2xl shadow-lg mt-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (editingCoupon ? "Salvar Alterações" : "Criar Cupom")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
