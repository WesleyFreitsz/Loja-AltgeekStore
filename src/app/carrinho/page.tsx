"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-outline hover:text-secondary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-on-background font-extrabold">Seu Carrinho</h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
            <div className="w-20 h-20 bg-surface-variant rounded-full flex items-center justify-center text-outline">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-xl text-on-surface font-bold">Opa! Seu carrinho está vazio.</h2>
              <p className="font-body text-on-surface-variant">Parece que você ainda não adicionou nenhum drop épico.</p>
            </div>
            <Link href="/" className="bg-primary text-on-primary font-label text-sm py-3 px-8 rounded-full btn-squishy">
              Voltar às compras
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant flex gap-4 items-center shadow-sm">
                  <div className="w-24 h-24 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-display text-lg text-on-surface font-bold">{item.name}</h3>
                    <p className="font-display text-secondary font-bold">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-container rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded-full text-on-surface transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-label w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded-full text-on-surface transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-outline hover:text-error transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant h-fit flex flex-col gap-6 sticky top-28">
              <h2 className="font-display text-xl text-on-surface font-bold">Resumo do Pedido</h2>
              <div className="flex flex-col gap-3 border-b border-outline-variant pb-6">
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Frete</span>
                  <span className="text-tertiary font-bold italic">Grátis</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-label text-on-surface font-bold">Total</span>
                <span className="font-display text-3xl text-primary font-extrabold">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <Link 
                href="/checkout" 
                className="w-full bg-primary text-on-primary font-label text-sm py-4 rounded-2xl btn-squishy flex items-center justify-center gap-2"
              >
                Finalizar Compra <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-[10px] text-center text-outline uppercase tracking-widest font-bold">
                Pagamento seguro via Asaas
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

import { ShoppingCart } from "lucide-react";
