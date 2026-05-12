import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, RefreshCw, Undo2 } from "lucide-react";

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-16">
        <section className="flex flex-col gap-6">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
            Políticas de <span className="text-tertiary italic">Troca e Devolução</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            Sua satisfação é nossa prioridade absoluta. Se por algum motivo você não estiver 100% feliz com sua compra, estamos aqui para resolver.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div className="bg-tertiary/10 text-tertiary w-12 h-12 rounded-2xl flex items-center justify-center">
              <Undo2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg">Direito de Arrependimento</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Você tem até 7 dias corridos após o recebimento para desistir da compra e receber seu dinheiro de volta.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-secondary/10 text-secondary w-12 h-12 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg">Troca por Tamanho</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Ficou apertado ou muito largo? Realizamos a primeira troca sem custo de frete para você.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg">Defeitos de Fábrica</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Garantia de 30 dias contra qualquer defeito na costura ou estampa. Trocamos por uma nova imediatamente.
            </p>
          </div>
        </div>

        <section className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant flex flex-col gap-8">
          <h2 className="font-display text-2xl font-bold">Como solicitar?</h2>
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <div className="bg-on-surface text-surface w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black">1</div>
              <div>
                <h4 className="font-bold text-lg">Acesse o Portal de Trocas</h4>
                <p className="text-sm text-on-surface-variant">Entre com seu número de pedido e e-mail no nosso portal dedicado.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-on-surface text-surface w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black">2</div>
              <div>
                <h4 className="font-bold text-lg">Escolha o motivo</h4>
                <p className="text-sm text-on-surface-variant">Selecione se deseja trocar por outro tamanho/modelo ou devolver.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="bg-on-surface text-surface w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black">3</div>
              <div>
                <h4 className="font-bold text-lg">Postagem reversa</h4>
                <p className="text-sm text-on-surface-variant">Você receberá um código de postagem gratuita para levar aos Correios.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-tertiary/5 p-8 rounded-3xl border border-tertiary/20 flex flex-col md:flex-row items-center gap-6 justify-between">
          <p className="font-body text-on-surface-variant italic">
            "Queremos que você vista AltGeek com orgulho e conforto."
          </p>
          <button className="bg-tertiary text-on-tertiary px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg">
            Ir para Portal de Trocas
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
