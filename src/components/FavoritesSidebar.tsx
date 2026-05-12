"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { X, Heart, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Favorite {
  productId: string;
  product: FavoriteProduct;
}

export default function FavoritesSidebar() {
  const { isFavoritesOpen, setIsFavoritesOpen, addToCart } = useCart();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFavoritesOpen && user) {
      loadFavorites();
    }
  }, [isFavoritesOpen, user]);

  const loadFavorites = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        body: JSON.stringify({ userId: user.id, productId }),
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.productId !== productId));
        toast.success("Produto removido dos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      toast.error("Erro ao remover favorito");
    }
  };

  const handleAddToCart = (product: FavoriteProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success("Produto adicionado ao carrinho!");
    setIsFavoritesOpen(false);
  };

  return (
    <AnimatePresence>
      {isFavoritesOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFavoritesOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-on-secondary-fixed text-secondary-fixed">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 fill-current" />
                <h2 className="font-display text-xl font-bold italic">MEUS FAVORITOS</h2>
                <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              </div>
              <button
                onClick={() => setIsFavoritesOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-outline-variant">
              {!user ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-outline">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Faça login</h3>
                  <p className="text-on-surface-variant text-sm max-w-[200px]">
                    Entre na sua conta para ver seus itens favoritos.
                  </p>
                  <Link
                    href="/login?redirect=/perfil?tab=favoritos"
                    onClick={() => setIsFavoritesOpen(false)}
                    className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Fazer Login
                  </Link>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-outline">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Nenhum favorito!</h3>
                  <p className="text-on-surface-variant text-sm max-w-[200px]">
                    Você ainda não adicionou nenhum produto aos favoritos.
                  </p>
                  <button
                    onClick={() => setIsFavoritesOpen(false)}
                    className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Explorar Produtos
                  </button>
                </div>
              ) : (
                favorites.map((item) => (
                  <div key={item.productId} className="flex gap-4 group">
                    <Link
                      href={`/produto/${item.productId}`}
                      onClick={() => setIsFavoritesOpen(false)}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low shrink-0 block"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <Link
                          href={`/produto/${item.productId}`}
                          onClick={() => setIsFavoritesOpen(false)}
                          className="hover:text-primary transition-colors"
                        >
                          <h4 className="font-display font-bold text-sm leading-tight line-clamp-2">
                            {item.product.name}
                          </h4>
                        </Link>
                        <p className="text-primary font-bold mt-1">
                          R$ {item.product.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => handleAddToCart(item.product)}
                          className="flex items-center gap-2 bg-secondary text-on-secondary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Adicionar
                        </button>
                        <button
                          onClick={() => removeFavorite(item.productId)}
                          className="text-outline hover:text-error transition-colors p-2"
                          title="Remover dos favoritos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {user && favorites.length > 0 && (
              <div className="p-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-4">
                <button
                  onClick={() => setIsFavoritesOpen(false)}
                  className="w-full py-2 text-sm font-label font-bold text-outline hover:text-on-surface transition-colors"
                >
                  Continuar Explorando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
