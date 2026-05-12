import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, PackageX } from "lucide-react";
import Link from "next/link";

async function getProducts(searchParams: { categoria?: string; promocao?: string; busca?: string; minPrice?: string; maxPrice?: string; ordenacao?: string }) {
  const { categoria, promocao, busca, minPrice, maxPrice, ordenacao } = searchParams;
  
  const min = minPrice ? parseFloat(minPrice) : undefined;
  const max = maxPrice ? parseFloat(maxPrice) : undefined;
  
  let orderBy: any = { createdAt: 'desc' };
  if (ordenacao === 'preco_asc') orderBy = { price: 'asc' };
  if (ordenacao === 'preco_desc') orderBy = { price: 'desc' };
  if (ordenacao === 'novo') orderBy = { createdAt: 'desc' };

  const products = await prisma.product.findMany({
    where: {
      AND: [
        categoria ? { category: categoria } : {},
        promocao === "true" ? { isPromotion: true } : {},
        busca ? { 
          OR: [
            { name: { contains: busca } },
            { description: { contains: busca } },
            { category: { contains: busca } }
          ]
        } : {},
        min !== undefined && !isNaN(min) ? { price: { gte: min } } : {},
        max !== undefined && !isNaN(max) ? { price: { lte: max } } : {},
      ]
    },
    orderBy,
  });
  return products;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; promocao?: string; busca?: string; minPrice?: string; maxPrice?: string; ordenacao?: string }>;
}) {
  const resolvedParams = await searchParams;
  const products = await getProducts(resolvedParams);
  const categories = ["Camisetas", "Moletons", "Acessórios"];

  return (
    <>
      <Header />
      <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full py-12 flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl font-black italic text-on-surface">CATÁLOGO</h1>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/catalogo"
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 ${!resolvedParams.categoria && !resolvedParams.promocao ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'}`}
          >
            Todos
          </Link>
          <Link 
            href="/catalogo?promocao=true"
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 ${resolvedParams.promocao === "true" ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'}`}
          >
            Promoções
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat}
              href={`/catalogo?categoria=${cat}`}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 ${resolvedParams.categoria === cat ? 'bg-secondary border-secondary text-on-secondary' : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-secondary'}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="flex flex-col gap-8 md:sticky top-32 h-fit mb-8 md:mb-0">
          <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary font-bold">
              <SlidersHorizontal size={20} />
              <span>Filtros Avançados</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <form action="/catalogo" method="GET" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest">Busca</label>
                  <input 
                    name="busca"
                    type="text" 
                    placeholder="Ex: moletom..."
                    defaultValue={resolvedParams.busca}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-3 pr-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

               
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest">Preço Máximo (R$)</label>
                  <input 
                    name="maxPrice"
                    type="number" 
                    step="0.01"
                    placeholder="999.99"
                    defaultValue={resolvedParams.maxPrice}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-3 pr-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest">Ordenar por</label>
                  <select 
                    name="ordenacao"
                    defaultValue={resolvedParams.ordenacao || "novo"}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-3 pr-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="novo">Mais Novos</option>
                    <option value="preco_asc">Menor Preço</option>
                    <option value="preco_desc">Maior Preço</option>
                  </select>
                </div>
                
                {/* Maintain category and promo state if they exist */}
                {resolvedParams.categoria && <input type="hidden" name="categoria" value={resolvedParams.categoria} />}
                {resolvedParams.promocao && <input type="hidden" name="promocao" value={resolvedParams.promocao} />}
                
                <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2">
                  <Search size={18} /> Filtrar
                </button>
              </form>
            </div>
          </div>
          
    
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-outline">
                <PackageX size={40} />
              </div>
              <h2 className="text-2xl font-display font-black text-on-surface-variant">OPS! NADA POR AQUI...</h2>
              <p className="text-on-surface-variant max-w-xs">
                Não encontramos nenhum item com esses filtros. Tente mudar sua busca ou categoria!
              </p>
              <Link href="/catalogo" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                Limpar Filtros
              </Link>
            </div>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
