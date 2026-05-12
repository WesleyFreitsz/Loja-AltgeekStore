"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CreditCard, QrCode, FileText, Lock, Loader2, Flame, Rocket, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "BOLETO" | "CREDIT_CARD">("PIX");
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const hasDiscount = timeLeft > 0;
  const discountMultiplier = hasDiscount ? 0.9 : 1;
  const finalPrice = totalPrice * discountMultiplier;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    phone: "",
    postalCode: "",
    address: "",
    addressNumber: "",
    province: "",
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  useEffect(() => {
    // Não redireciona mais se não houver usuário. Permite checkout como convidado.
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing time
    setTimeout(() => {
      setLoading(false);
      setShowPortfolioModal(true);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 gap-6">
          <h2 className="font-display text-2xl font-bold">Carrinho vazio</h2>
          <Link href="/" className="text-primary hover:underline font-bold underline-offset-4">Voltar para a loja</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/carrinho" className="text-outline hover:text-secondary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-on-background font-extrabold">Finalizar Pedido</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Info Section */}
          <div className="flex flex-col gap-8">
            <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Nome Completo</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="Seu nome aqui"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Email</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">CPF / CNPJ</label>
                  <input 
                    required
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">CEP</label>
                  <input 
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="00000-000"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Rua / Avenida</label>
                  <input 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="Rua das Flores"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Número</label>
                  <input 
                    required
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="123"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Bairro</label>
                  <input 
                    required
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    placeholder="Centro"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Payment & Summary Section */}
          <div className="flex flex-col gap-8">
            {hasDiscount && (
              <div className="bg-error/10 border border-error/20 p-4 rounded-3xl flex flex-col gap-2 items-center text-center shadow-sm animate-in fade-in zoom-in duration-500">
                <p className="text-error font-bold font-display flex items-center gap-2">
                  <Flame className="w-5 h-5 animate-pulse" /> 
                  Oferta acabando!
                </p>
                <div className="text-4xl font-black text-error font-display tracking-widest">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <p className="text-sm text-error font-bold uppercase tracking-wider mt-2">
                  Finalize agora e garanta 10% de desconto extra!
                </p>
              </div>
            )}

            <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Método de Pagamento
              </h2>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PIX")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    paymentMethod === "PIX" ? "border-secondary bg-secondary/5" : "border-outline-variant hover:border-outline"
                  )}
                >
                  <div className="bg-tertiary/10 p-3 rounded-xl text-tertiary">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">PIX</p>
                    <p className="text-xs text-on-surface-variant">Aprovação imediata e 5% de desconto</p>
                  </div>
                  {paymentMethod === "PIX" && <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    paymentMethod === "CREDIT_CARD" ? "border-secondary bg-secondary/5" : "border-outline-variant hover:border-outline"
                  )}
                >
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Cartão de Crédito</p>
                    <p className="text-xs text-on-surface-variant">Parcele em até 12x sem juros</p>
                  </div>
                  {paymentMethod === "CREDIT_CARD" && <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BOLETO")}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    paymentMethod === "BOLETO" ? "border-secondary bg-secondary/5" : "border-outline-variant hover:border-outline"
                  )}
                >
                  <div className="bg-on-surface/10 p-3 rounded-xl text-on-surface">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Boleto Bancário</p>
                    <p className="text-xs text-on-surface-variant">Vencimento em 3 dias úteis</p>
                  </div>
                  {paymentMethod === "BOLETO" && <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-secondary/20" />}
                </button>
              </div>

              {paymentMethod === "CREDIT_CARD" && (
                <div className="mt-6 p-6 bg-surface-container-low rounded-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Nome no Cartão</label>
                    <input 
                      required={paymentMethod === "CREDIT_CARD"}
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="COMO ESTÁ NO CARTÃO"
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Número do Cartão</label>
                    <input 
                      required={paymentMethod === "CREDIT_CARD"}
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Validade (MM/AA)</label>
                      <input 
                        required={paymentMethod === "CREDIT_CARD"}
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">CVV</label>
                      <input 
                        required={paymentMethod === "CREDIT_CARD"}
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-on-secondary-fixed p-8 rounded-3xl text-surface-container-lowest flex flex-col gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <h2 className="font-display text-2xl font-bold">Resumo Final</h2>
              <div className="flex flex-col gap-4 text-sm opacity-80 font-body">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-surface-container-lowest/20 pt-6 flex flex-col gap-2">
                {hasDiscount && (
                  <div className="flex justify-between items-center text-primary-container font-bold bg-primary-container/20 p-3 rounded-xl border border-primary-container/30">
                    <span className="flex items-center gap-2"><Flame className="w-4 h-4" /> Desconto Extra (10%)</span>
                    <span>- R$ {(totalPrice * 0.1).toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between items-end mt-4">
                  <span className="font-label text-lg">Total a pagar</span>
                  <span className="font-display text-4xl font-extrabold text-primary-container">
                    R$ {finalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-display text-lg font-bold py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> Confirmar e Pagar
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] opacity-60 uppercase tracking-widest font-bold mt-2">
                <span className="material-symbols-outlined text-xs">verified_user</span>
                Ambiente 100% Seguro
              </div>
            </section>
          </div>
        </form>

        {showPortfolioModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                <Rocket className="w-10 h-10" />
              </div>
              <h2 className="font-display font-black text-3xl mb-4 text-on-surface">Gostou da loja?</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                Este é um projeto de <strong>portfólio</strong>! O fluxo de pagamento real foi desativado. 
                <br/><br/>
                Se você está procurando um desenvolvedor para criar experiências modernas, rápidas e com alto poder de conversão como esta, <strong>vamos conversar e desenvolver algo ainda melhor para o seu negócio!</strong>
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <a 
                  href="https://www.linkedin.com/in/wesleyfreitasz/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Briefcase className="w-5 h-5" /> Me Contratar
                </a>
                <button 
                  onClick={() => setShowPortfolioModal(false)}
                  className="w-full bg-surface-container-high text-on-surface font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
                >
                  Voltar para o Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
