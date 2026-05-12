"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container text-on-surface w-full py-12 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto">
      {/* Brand / Identity */}
      <div className="flex flex-col gap-4">
        <Link href="/" className="font-display text-2xl text-primary font-bold italic tracking-tighter">
          AltGeekStore
        </Link>
        <p className="font-body text-sm text-on-surface-variant max-w-xs">
          Loja alternativa com produtos que fogem do comum. 
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-3">
        <h4 className="font-label text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
          Ajuda & Suporte
        </h4>
        <Link href="/sobre" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
          Sobre a Loja
        </Link>
        <Link href="/contato" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
          Fale Conosco
        </Link>
        <Link href="/faq" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
          Dúvidas Frequentes
        </Link>
        <Link href="/politicas" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
          Políticas de Troca
        </Link>
      </div>

      {/* Social & Copyright */}
      <div className="flex flex-col gap-4">
        <h4 className="font-label text-xs font-bold text-on-surface mb-2 uppercase tracking-widest">
          Siga a AltGeek
        </h4>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = "https://www.linkedin.com/in/wesleyfreitasz/"}
            className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">public</span>
          </button>
          <button 
            onClick={() => window.location.href = "https://www.linkedin.com/in/wesleyfreitasz/"}
            className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">photo_camera</span>
          </button>
        </div>
        <div className="mt-auto pt-8 border-t border-outline-variant/30">
          <p className="font-body text-xs text-on-surface-variant">
            © 2026 AltGeekStore. Criado com ❤️ para Geeks.
          </p>
        </div>
      </div>
    </footer>
  );
}
