"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Coupon {
  code: string;
  discountType: string;
  value: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discountValue: number;
  finalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load cart and coupon from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("altgeek-cart");
    const savedCoupon = localStorage.getItem("altgeek-coupon");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error("Erro ao carregar cupom:", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("altgeek-cart", JSON.stringify(cart));
  }, [cart]);

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("altgeek-coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("altgeek-coupon");
    }
  }, [appliedCoupon]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
    // Abrir o carrinho automaticamente ao adicionar item
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const applyCoupon = (coupon: Coupon | null) => setAppliedCoupon(coupon);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discountValue = (totalPrice * appliedCoupon.value) / 100;
    } else {
      discountValue = appliedCoupon.value;
    }
  }

  const finalPrice = Math.max(0, totalPrice - discountValue);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        discountValue,
        finalPrice,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        appliedCoupon,
        applyCoupon,
        isFavoritesOpen,
        setIsFavoritesOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
