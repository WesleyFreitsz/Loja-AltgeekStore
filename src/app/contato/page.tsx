import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background tracking-tight mb-4">
                Fale com a <span className="text-secondary italic">Equipe</span>
              </h1>
              <p className="font-body text-lg text-on-surface-variant">
                Tem alguma dúvida sobre seu pedido, sugestão ou apenas quer dar um "oi"? Estamos aqui para te ouvir.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">E-mail</h4>
                  <p className="text-sm text-on-surface-variant">contato@altgeekstore.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 text-secondary p-3 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">WhatsApp</h4>
                  <p className="text-sm text-on-surface-variant">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-tertiary/10 text-tertiary p-3 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Base de Operações</h4>
                  <p className="text-sm text-on-surface-variant">Rua Cyberpunk, 2077 - Bairro do Futuro, São Paulo - SP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-xl flex flex-col gap-6">
            <h2 className="font-display text-2xl font-bold">Mande sua mensagem</h2>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Nome</label>
                <input 
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">E-mail</label>
                <input 
                  type="email"
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider ml-1">Mensagem</label>
                <textarea 
                  rows={4}
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"
                  placeholder="No que podemos te ajudar hoje?"
                />
              </div>
              <button className="bg-secondary text-on-secondary font-display text-lg font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg">
                Enviar Mensagem <Send className="w-5 h-5" />
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
