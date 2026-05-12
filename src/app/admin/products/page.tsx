"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Loader2, Package } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  isPromotion: boolean;
  image: string;
  category: string;
  specs: string;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    oldPrice: 0,
    isPromotion: false,
    image: "",
    category: "Camisetas",
    specs: [""]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice || 0,
        isPromotion: product.isPromotion,
        image: product.image,
        category: product.category,
        specs: JSON.parse(product.specs)
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        oldPrice: 0,
        isPromotion: false,
        image: "",
        category: "Camisetas",
        specs: [""]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingProduct 
      ? `/api/admin/products/${editingProduct.id}` 
      : "/api/admin/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          oldPrice: formData.isPromotion ? Number(formData.oldPrice) : null,
          specs: formData.specs.filter(s => s !== "")
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-on-background">Gerenciar Produtos</h1>
          <p className="text-on-surface-variant italic">Adicione, edite ou remova produtos da sua loja.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Produto</th>
                <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Categoria</th>
                <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Preço</th>
                <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-outline uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/30 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container-highest flex-shrink-0 border border-outline-variant">
                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="font-bold text-on-background text-sm max-w-[200px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-background">R$ {product.price.toFixed(2)}</span>
                      {product.isPromotion && product.oldPrice && (
                        <span className="text-[10px] text-outline line-through">R$ {product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {product.isPromotion ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-error text-on-error uppercase">PROMO</span>
                    ) : (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-outline-variant text-outline uppercase">NORMAL</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-outline-variant flex flex-col">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center sticky top-0 bg-surface-container-lowest z-10">
              <h3 className="font-display text-2xl font-black text-on-background">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Nome do Produto</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="Camisetas">Camisetas</option>
                    <option value="Moletons">Moletons</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Descrição</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Preço Atual</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Preço Antigo (Opcional)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})}
                    disabled={!formData.isPromotion}
                    className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox"
                    id="isPromotion"
                    checked={formData.isPromotion}
                    onChange={(e) => setFormData({...formData, isPromotion: e.target.checked})}
                    className="w-5 h-5 accent-primary"
                  />
                  <label htmlFor="isPromotion" className="text-sm font-bold text-on-background">Em Promoção?</label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">URL da Imagem</label>
                <input 
                  required
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Especificações</label>
                {formData.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text"
                      value={spec}
                      onChange={(e) => {
                        const newSpecs = [...formData.specs];
                        newSpecs[index] = e.target.value;
                        setFormData({...formData, specs: newSpecs});
                      }}
                      className="flex-1 bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newSpecs = formData.specs.filter((_, i) => i !== index);
                        setFormData({...formData, specs: newSpecs});
                      }}
                      className="p-2 text-error hover:bg-error/10 rounded-xl"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, specs: [...formData.specs, ""]})}
                  className="text-primary text-sm font-bold hover:underline self-start flex items-center gap-1"
                >
                  <Plus size={16} /> Adicionar especificação
                </button>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-display text-lg font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (editingProduct ? "Salvar Alterações" : "Criar Produto")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
