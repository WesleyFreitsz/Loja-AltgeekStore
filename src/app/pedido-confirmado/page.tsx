"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Copy, ExternalLink, QrCode, FileText, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lastOrder = localStorage.getItem("last_order");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  const copyPixPayload = () => {
    if (order?.pix?.payload) {
      navigator.clipboard.writeText(order.pix.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-display text-xl font-bold">Carregando seu pedido...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8">
        {/* Celebration Header */}
        <section className="text-center flex flex-col items-center gap-4 py-8">
          <div className="bg-tertiary/10 text-tertiary p-4 rounded-full mb-2">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background">Pedido Confirmado!</h1>
          <p className="text-on-surface-variant max-w-md mx-auto italic">
            Uhul! Sua compra na AltGeekStore foi processada com sucesso. Agora é só aguardar o nível chegar na sua casa.
          </p>
        </section>

        {/* Payment Details */}
        <section className="bg-surface-container-lowest p-8 rounded-3xl border-2 border-outline-variant shadow-lg flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full" />
          
          <h2 className="font-display text-2xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">payments</span>
            Pagamento
          </h2>

          {order.pix ? (
            <div className="flex flex-col md:flex-row gap-8 items-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <div className="bg-white p-4 rounded-xl shadow-inner border border-outline-variant">
                <img 
                  src={`data:image/png;base64,${order.pix.encodedImage}`} 
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    Pague com PIX
                  </h3>
                  <p className="text-sm text-on-surface-variant">Escaneie o código ao lado ou copie o código abaixo para pagar no seu banco.</p>
                </div>
                
                <button 
                  onClick={copyPixPayload}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all font-label",
                    copied ? "bg-tertiary/10 border-tertiary text-tertiary" : "bg-surface-container-highest border-outline-variant hover:border-secondary"
                  )}
                >
                  <span className="truncate text-xs opacity-60 max-w-[200px]">{order.pix.payload}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {copied ? (
                      <>Copiado! <CheckCircle2 className="w-4 h-4" /></>
                    ) : (
                      <>Copiar Código <Copy className="w-4 h-4" /></>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Acesse sua Fatura</p>
                    <p className="text-xs text-on-surface-variant">Clique no botão para ver o boleto ou detalhes do cartão.</p>
                  </div>
                </div>
                <a 
                  href={order.invoiceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  Ver Fatura <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] text-outline uppercase tracking-widest font-bold border-t border-outline-variant pt-4 mt-2">
            ID do Pagamento: {order.paymentId}
          </div>
        </section>

        {/* Next Steps */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-high p-6 rounded-3xl flex flex-col gap-3">
            <h3 className="font-display font-bold text-lg">Acompanhe seu e-mail</h3>
            <p className="text-sm text-on-surface-variant">Enviamos todos os detalhes do seu pedido e atualizações de rastreio para você.</p>
          </div>
          <div className="bg-surface-container-high p-6 rounded-3xl flex flex-col gap-3">
            <h3 className="font-display font-bold text-lg">Dúvidas?</h3>
            <p className="text-sm text-on-surface-variant">Nosso suporte está pronto para te ajudar. Entre em contato via WhatsApp ou e-mail.</p>
          </div>
        </section>

        {/* Back to Shop */}
        <div className="flex justify-center py-8">
          <Link 
            href="/" 
            className="group flex items-center gap-2 font-display text-lg font-bold text-primary hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            Continuar Comprando
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Loader2({ className }: { className?: string }) {
  return <span className={cn("material-symbols-outlined animate-spin", className)}>progress_activity</span>;
}
