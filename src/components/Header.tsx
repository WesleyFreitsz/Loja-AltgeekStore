"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Flame, LogOut, Lock, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function HeaderInner() {
  const { totalItems, setIsCartOpen, setIsFavoritesOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("busca") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?busca=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/catalogo");
    }
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("busca") || "");
  }, [searchParams]);

  return (
    <header className="bg-on-secondary-fixed text-secondary-fixed flex flex-col w-full px-margin-mobile md:px-margin-desktop py-4 gap-4 sticky top-0 z-50 border-none shadow-[0_4px_20px_rgba(129,39,207,0.15)]">
      <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
        {/* Mobile Menu Button (Left) */}
        <div className="flex flex-1 md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-surface-container-lowest hover:text-primary-fixed-dim"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search (Left Desktop) */}
        <div className="hidden md:flex flex-1">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              className="w-full bg-surface-container-lowest text-on-surface rounded-full py-2 pl-4 pr-10 border border-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-label text-sm placeholder:text-outline shadow-inner"
              placeholder="Buscar"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-outline hover:text-secondary transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Brand Logo (Center) */}
        <div className="flex-1 md:flex-none flex justify-center">
          <Link href="/" className="font-display text-3xl text-primary-container italic tracking-tighter font-extrabold hover:scale-105 transition-transform active:scale-95">
            AltGeekStore
          </Link>
        </div>

        {/* Trailing Icons (Right) */}
        <div className="flex flex-1 justify-end items-center gap-4">
          <div className="hidden md:block group relative">
            <Link 
              href={user ? (user.isAdmin ? "/admin" : "/perfil") : "/login"}
              className="text-surface-container-lowest hover:text-primary-fixed-dim hover:scale-110 transition-all duration-300 ease-out flex items-center gap-2"
              title={user ? (user.isAdmin ? "Painel Admin" : "Meu Perfil") : "Fazer Login"}
            >
              <User className="w-6 h-6" />
              {user && <span className="hidden lg:block text-xs font-bold truncate max-w-[80px]">{user.name?.split(' ')[0]}</span>}
            </Link>
            
            {user && (
              <div className="absolute right-0 top-full mt-2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-surface-container-lowest border border-outline-variant p-2 rounded-xl shadow-xl min-w-[150px]">
                  <Link href="/perfil" className="flex items-center gap-2 p-2 hover:bg-surface-container-low rounded-lg text-xs font-bold transition-colors">
                    <User className="w-4 h-4" /> Meu Perfil
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 p-2 hover:bg-surface-container-low rounded-lg text-xs font-bold transition-colors text-primary">
                      <Lock className="w-4 h-4" /> Painel Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 p-2 hover:bg-error/10 text-error rounded-lg text-xs font-bold transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsFavoritesOpen(true)}
            className="hidden md:block text-surface-container-lowest hover:text-primary-fixed-dim hover:scale-110 transition-all duration-300 ease-out active:scale-95"
            title="Meus Favoritos"
          >
            <Heart className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-surface-container-lowest hover:text-primary-fixed-dim hover:scale-110 transition-all duration-300 ease-out active:scale-95 relative"
            title="Carrinho"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-on-secondary-fixed">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links Desktop */}
      <nav className="hidden md:flex items-center w-full max-w-container-max mx-auto justify-center gap-8 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <Link
          href="/catalogo?categoria=Camisetas"
          className="text-surface-container-lowest hover:text-primary-fixed-dim transition-colors duration-200 font-label text-sm whitespace-nowrap uppercase font-black italic tracking-wider"
        >
          Camisetas
        </Link>
        <Link
          href="/catalogo?categoria=Moletons"
          className="text-surface-container-lowest hover:text-primary-fixed-dim transition-colors duration-200 font-label text-sm whitespace-nowrap uppercase font-black italic tracking-wider"
        >
          Moletons
        </Link>
        <Link
          href="/catalogo?categoria=Acessórios"
          className="text-surface-container-lowest hover:text-primary-fixed-dim transition-colors duration-200 font-label text-sm whitespace-nowrap uppercase font-black italic tracking-wider"
        >
          Acessórios
        </Link>
        <Link
          href="/catalogo?promocao=true"
          className="text-primary-container hover:text-primary-fixed-dim transition-colors duration-200 font-label text-sm whitespace-nowrap flex items-center gap-1 uppercase font-black italic tracking-wider bg-primary/20 px-3 py-1 rounded-full"
        >
          Promoções <Flame className="w-4 h-4 fill-current animate-pulse" />
        </Link>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4 border-t border-outline-variant/20">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              className="w-full bg-surface-container-lowest text-on-surface rounded-full py-2 pl-4 pr-10 border border-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary font-label text-sm placeholder:text-outline shadow-inner"
              placeholder="Buscar loot kawaii..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-outline hover:text-secondary transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
          
          <div className="flex flex-col gap-4 py-2">
            <Link onClick={() => setIsMenuOpen(false)} href="/catalogo?categoria=Camisetas" className="text-surface-container-lowest font-label text-sm uppercase font-black italic">Camisetas</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/catalogo?categoria=Moletons" className="text-surface-container-lowest font-label text-sm uppercase font-black italic">Moletons</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/catalogo?categoria=Acessórios" className="text-surface-container-lowest font-label text-sm uppercase font-black italic">Acessórios</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/catalogo?promocao=true" className="text-primary-container font-label text-sm flex items-center gap-1 uppercase font-black italic w-fit bg-primary/20 px-3 py-1 rounded-full">Promoções <Flame className="w-4 h-4 fill-current animate-pulse" /></Link>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant/20">
            <Link href={user ? (user.isAdmin ? "/admin" : "/perfil") : "/login"} onClick={() => setIsMenuOpen(false)} className="text-surface-container-lowest flex items-center gap-2 font-bold">
              <User className="w-5 h-5" /> {user ? "Meu Perfil" : "Fazer Login"}
            </Link>
            <button onClick={() => { setIsFavoritesOpen(true); setIsMenuOpen(false); }} className="text-surface-container-lowest flex items-center gap-2 font-bold">
              <Heart className="w-5 h-5" /> Meus Favoritos
            </button>
            {user && (
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 text-error font-bold text-left"
              >
                <LogOut className="w-5 h-5" /> Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="bg-on-secondary-fixed text-secondary-fixed flex flex-col w-full px-margin-mobile md:px-margin-desktop py-4 gap-4 sticky top-0 z-50 border-none shadow-[0_4px_20px_rgba(129,39,207,0.15)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto">
          <div className="hidden md:flex flex-1" />
          <div className="flex-1 md:flex-none flex justify-center">
            <span className="font-display text-3xl text-primary-container italic tracking-tighter font-extrabold">AltGeekStore</span>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4" />
        </div>
      </header>
    }>
      <HeaderInner />
    </Suspense>
  );
}
