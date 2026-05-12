"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Star, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    specs: string; // JSON stringified
    reviews?: {
      id: string;
      rating: number;
    }[];
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const specs = JSON.parse(product.specs || "[]") as string[];

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
    : 0;

  // Fetch initial favorite status
  useEffect(() => {
    if (user) {
      fetch(`/api/favorites?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((fav: any) => fav.productId === product.id));
          }
        })
        .catch(err => console.error("Error fetching favorite status:", err));
    }
  }, [user, product.id]);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedSize}`,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Faça login para favoritar produtos!", {
        icon: "❤️",
      });
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await fetch("/api/favorites", {
          method: "DELETE",
          body: JSON.stringify({ userId: user.id, productId: product.id }),
        });
        setIsFavorite(false);
        toast.success("Removido dos favoritos");
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ userId: user.id, productId: product.id }),
        });
        setIsFavorite(true);
        toast.success("Adicionado aos favoritos!");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-[4/5] bg-surface-container-low rounded-3xl overflow-hidden border-2 border-outline-variant relative group">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button 
            onClick={toggleFavorite}
            disabled={loadingFavorite}
            className={cn(
              "absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full transition-all shadow-sm hover:scale-110 active:scale-90",
              isFavorite ? "text-error" : "text-on-surface hover:text-primary"
            )}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div 
            className="flex items-center gap-2 text-tertiary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (!user) {
                toast.error("Faça login para avaliar produtos!", { icon: "⭐" });
              } else {
                // Scroll to reviews section
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="flex text-tertiary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-4 h-4", i < Math.round(averageRating) ? "fill-current text-tertiary" : "fill-transparent text-outline-variant")} />
              ))}
            </div>
            <span className="text-xs font-bold font-label uppercase tracking-wider">
              {reviews.length > 0 ? `${averageRating.toFixed(1)} (${reviews.length} Avaliações)` : "Avaliar"}
            </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl font-black text-primary">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-sm text-outline line-through font-label">
              R$ {(product.price * 1.2).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm">
          <p className="text-on-surface-variant font-body leading-relaxed">
            {product.description}
          </p>
          
          {specs.length > 0 && (
            <ul className="flex flex-col gap-3">
              {specs.map((spec, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-label text-on-surface">
                  <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                    <Check className="w-3 h-3" />
                  </div>
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>

        </div>

        {/* Size Selector */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold font-label uppercase tracking-wider text-on-surface">Tamanho</span>
          <div className="flex gap-3">
            {['P', 'M', 'G', 'GG'].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "w-12 h-12 cursor-pointer rounded-xl font-bold transition-all border-2 flex items-center justify-center",
                  selectedSize === size 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-outline-variant text-on-surface-variant hover:border-outline"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={added}
              className={cn(
                "flex-1 font-display text-lg font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                added ? "bg-tertiary text-on-tertiary" : "bg-primary text-on-primary hover:bg-primary/90"
              )}
            >
              {added ? (
                <>
                  <Check className="w-6 h-6" /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" /> Colocar no Carrinho
                </>
              )}
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copiado!");
              }}
              className="p-5 bg-surface-container-high text-on-surface rounded-2xl border-2 border-outline-variant hover:border-secondary transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-[10px] text-center font-bold text-outline uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xs">local_shipping</span>
            Frete Grátis para todo o Brasil em compras acima de R$ 200
          </p>
        </div>
      </div>
  );
}
