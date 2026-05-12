import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import ReviewSection from "@/components/ReviewSection";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          <h2 className="font-display text-2xl font-bold">Produto não encontrado</h2>
          <Link href="/" className="text-primary hover:underline font-bold underline-offset-4">Voltar para a loja</Link>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = await prisma.product.findMany({
    where: { 
      id: { not: product.id },
      category: product.category
    },
    take: 4,
  });

  // Serializar reviews para passar como props (Date -> string)
  const serializedReviews = product.reviews.map(review => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-label text-outline mb-8">
          <Link href="/" className="hover:text-secondary transition-colors">Loja</Link>
          <span>/</span>
          <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-secondary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-on-surface font-bold">{product.name}</span>
        </div>

        <ProductDetailsClient product={product} />

        {/* Review Section - Client Component with live refresh */}
        <ReviewSection productId={product.id} initialReviews={serializedReviews} />

        {/* Related Products */}
        <section className="flex flex-col gap-12 mt-32 border-t-2 border-outline-variant pt-24">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display text-4xl font-extrabold text-on-background italic">QUEM VIU ESTE, TAMBÉM AMOU</h2>
              <p className="text-on-surface-variant font-body mt-2">Combine seu estilo com outras peças da coleção.</p>
            </div>
            <Link href="/" className="font-label text-sm font-bold text-secondary hover:underline flex items-center gap-2 group">
              Ver coleção completa
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
