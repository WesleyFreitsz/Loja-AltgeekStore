"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  description: string;
  image: string;
  isPromotion?: boolean;
}

interface ProductCardProps {
  product: Product;
  isInitiallyFavorite?: boolean;
}

export default function ProductCard({ product, isInitiallyFavorite = false }: ProductCardProps) {
  const { id, name, price, oldPrice, description, image, isPromotion } = product;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Faça login para favoritar produtos!", {
        icon: "❤️",
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await fetch("/api/favorites", {
          method: "DELETE",
          body: JSON.stringify({ userId: user.id, productId: id }),
        });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ userId: user.id, productId: id }),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <article className="product-card bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col group relative hover:shadow-xl transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isPromotion && (
          <span className="bg-primary text-on-primary font-label text-[10px] px-3 py-1 rounded-full shadow-sm border border-white/50 backdrop-blur-md uppercase tracking-wider font-bold animate-pulse">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={toggleFavorite}
          disabled={loadingFavorite}
          className={cn(
            "bg-surface-container-lowest/80 backdrop-blur transition-all p-2 rounded-full shadow-sm hover:scale-110 active:scale-90",
            isFavorite ? "text-error" : "text-outline hover:text-error"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Image */}
      <Link href={`/produto/${id}`} className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden cursor-pointer">
        <img
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          src={image}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link href={`/produto/${id}`} className="hover:text-primary transition-colors">
          <h3 className="font-display text-base md:text-lg text-on-surface leading-tight font-bold line-clamp-1">{name}</h3>
        </Link>
        
        <div className="flex flex-col">
          {oldPrice && (
            <span className="text-xs text-outline line-through">
              R$ {oldPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="font-display text-lg text-secondary font-bold whitespace-nowrap">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <p className="font-body text-xs text-on-surface-variant flex-1 line-clamp-2">{description}</p>
        
        <button 
          onClick={handleAddToCart}
          disabled={added}
          className={cn(
            "w-full font-label text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all font-bold",
            added ? "bg-tertiary text-on-tertiary" : "bg-primary text-on-primary hover:bg-primary/90 active:scale-95"
          )}
        >
          {added ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              No carrinho!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Comprar
            </>
          )}
        </button>
      </div>
    </article>
  );
}
