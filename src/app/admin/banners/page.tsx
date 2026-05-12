"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  active: boolean;
  order: number;
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    active: true,
    order: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/banners");
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Erro ao buscar banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner: Banner | null = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image: banner.image,
        link: banner.link || "",
        active: banner.active,
        order: banner.order
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        active: true,
        order: banners.length
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : "/api/admin/banners";
    const method = editingBanner ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchBanners();
      }
    } catch (error) {
      console.error("Erro ao salvar banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este banner?")) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      fetchBanners();
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-on-background">Banners da Home</h1>
          <p className="text-on-surface-variant italic">Gerencie os banners que aparecem na página inicial.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Novo Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && banners.length === 0 ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : banners.map((banner) => (
          <div key={banner.id} className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden shadow-sm flex flex-col group">
            <div className="relative aspect-[21/9] bg-surface-container-high border-b border-outline-variant">
              <img src={banner.image} alt={banner.title} className="object-cover w-full h-full" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(banner)} className="p-3 bg-white/90 text-primary rounded-2xl shadow-xl hover:scale-110 transition-transform">
                  <Edit size={20} />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-3 bg-white/90 text-error rounded-2xl shadow-xl hover:scale-110 transition-transform">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="absolute top-4 left-4">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border shadow-sm ${banner.active ? "bg-green-500 text-white border-green-600" : "bg-outline text-white border-outline-variant"}`}>
                  {banner.active ? "ATIVO" : "INATIVO"}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-on-background text-lg">{banner.title}</h3>
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Ordem: {banner.order}</span>
              </div>
              {banner.subtitle && <p className="text-sm text-on-surface-variant line-clamp-1">{banner.subtitle}</p>}
              {banner.link && (
                <div className="flex items-center gap-2 text-xs text-primary font-bold">
                  <LinkIcon size={14} /> {banner.link}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-lg rounded-[3rem] shadow-2xl border border-outline-variant flex flex-col overflow-hidden">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-display text-2xl font-black text-on-background">{editingBanner ? "Editar Banner" : "Novo Banner"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Título</label>
                <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Subtítulo</label>
                <input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">URL da Imagem</label>
                <input required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Link de Destino</label>
                <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Ordem</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 accent-primary" />
                  <label htmlFor="active" className="text-sm font-bold text-on-background">Ativo</label>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-on-primary font-display text-lg font-bold py-4 rounded-2xl shadow-lg mt-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (editingBanner ? "Atualizar Banner" : "Criar Banner")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
