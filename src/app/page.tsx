import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Flame, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

async function getData() {
  const [products, banners] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
  ]);
  return { products, banners };
}

export default async function HomePage() {
  const { products: allProducts, banners } = await getData();
  
  const categories = ["Moletons", "Camisetas", "Acessórios"];
  const promoProducts = allProducts.filter(p => p.isPromotion).slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex flex-col gap-16 pb-20 overflow-x-hidden">
      {/* Hero Banner Section */}
      <section className="relative">
        <Banner banners={banners} />
      </section>



      {/* Promotions Section */}
      {promoProducts.length > 0 && (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Descontos Reais</span>
                <Flame className="w-5 h-5 text-primary fill-primary animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black italic text-on-surface tracking-tighter uppercase">
                PROMOÇÕES <span className="text-primary">INSANAS</span>
              </h2>
            </div>
            <Link href="/catalogo?promocao=true" className="group flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-black italic hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30">
              VER TUDO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {promoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Category Sections */}
      {categories.map((category, idx) => {
        const categoryProducts = allProducts.filter(p => p.category === category).slice(0, 4);
        if (categoryProducts.length === 0) return null;

        const isEven = idx % 2 === 0;

        return (
          <section key={category} className={`py-16 ${!isEven ? 'bg-surface-container-lowest' : ''}`}>
            <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
              <div className="flex justify-between items-end mb-10">
                <div className="border-l-8 border-secondary pl-6">
                  <h2 className="text-4xl md:text-5xl font-display font-black italic text-on-surface uppercase tracking-tighter">
                    {category}
                  </h2>
                </div>
                <Link href={`/catalogo?categoria=${category}`} className="flex items-center gap-2 text-secondary hover:text-secondary-hover font-black italic transition-colors text-lg">
                  EXPLORAR <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      </main>

      {/* Institutional / Trust Section */}
      <section className="bg-on-surface text-surface py-20">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-3xl rotate-12 flex items-center justify-center text-on-primary shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="4" y="9" rx="2"/><path d="m4 9 8-4 8 4"/></svg>
            </div>
            <h3 className="font-display font-black text-2xl uppercase italic tracking-tight">Qualidade Premium</h3>
            <p className="text-surface-variant text-lg opacity-80">Tecidos 100% algodão penteado e estampas exclusivas que resistem ao tempo e às lavagens.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-secondary rounded-3xl -rotate-6 flex items-center justify-center text-on-secondary shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3 className="font-display font-black text-2xl uppercase italic tracking-tight">Compra 100% Segura</h3>
            <p className="text-surface-variant text-lg opacity-80">Ambiente criptografado e checkout protegido com a tecnologia Asaas de pagamentos.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-primary-container rounded-3xl rotate-3 flex items-center justify-center text-on-primary-container shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
            </div>
            <h3 className="font-display font-black text-2xl uppercase italic tracking-tight">Envio Ninja</h3>
            <p className="text-surface-variant text-lg opacity-80">Preparamos seu pedido com carinho e agilidade para chegar voando no seu endereço.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

