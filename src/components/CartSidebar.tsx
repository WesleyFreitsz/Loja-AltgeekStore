"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems, appliedCoupon, applyCoupon, discountValue, finalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
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
                <ShoppingBag className="w-6 h-6" />
                <h2 className="font-display text-xl font-bold italic">SEU CARRINHO</h2>
                <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-outline-variant">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-outline">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Carrinho vazio!</h3>
                  <p className="text-on-surface-variant text-sm max-w-[200px]">
                    Sua jornada geek começa adicionando itens aqui.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Explorar Produtos
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-display font-bold text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-primary font-bold mt-1">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-surface-container rounded-lg border border-outline-variant p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-outline hover:text-error transition-colors p-1"
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
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-4">
                {/* Coupon Section */}
                <div className="flex flex-col gap-2">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="CUPOM DE DESCONTO"
                        className="flex-1 bg-surface-container-high border border-outline-variant rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-colors uppercase tracking-widest"
                        id="coupon-input"
                      />
                      <button
                        onClick={async () => {
                          const input = document.getElementById('coupon-input') as HTMLInputElement;
                          const code = input.value;
                          if (!code) return;
                          
                          try {
                            const res = await fetch("/api/coupons/validate", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ code, cartTotal: totalPrice }),
                            });
                            const data = await res.json();
                            
                            if (res.ok) {
                              applyCoupon(data);
                              toast.success("Cupom aplicado!");
                            } else {
                              toast.error(data.error || "Erro ao aplicar cupom");
                            }
                          } catch (err) {
                            toast.error("Erro na conexão");
                          }
                        }}
                        className="bg-secondary text-on-secondary px-4 py-2 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-colors"
                      >
                        APLICAR
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-tertiary/10 border border-tertiary/20 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary">sell</span>
                        <span className="text-xs font-bold text-tertiary uppercase tracking-widest">{appliedCoupon.code}</span>
                      </div>
                      <button 
                        onClick={() => applyCoupon(null)}
                        className="text-error hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-label text-xs uppercase font-bold">Subtotal</span>
                    <span className="font-bold text-on-surface">
                      R$ {totalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex justify-between items-center text-tertiary">
                      <span className="font-label text-xs uppercase font-bold">Desconto</span>
                      <span className="font-bold">
                        - R$ {discountValue.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 mt-1">
                    <span className="text-on-surface font-label text-sm uppercase font-black tracking-tight">Total</span>
                    <span className="font-display text-2xl font-black text-secondary">
                      R$ {finalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-outline text-center uppercase tracking-widest font-bold">
                  Frete calculado no checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg hover:shadow-primary/20 active:scale-95 transition-all group"
                >
                  Finalizar Compra
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-sm font-label font-bold text-outline hover:text-on-surface transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
