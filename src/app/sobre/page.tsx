import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-12">
        <section className="flex flex-col gap-6">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
            Nossa Missão: Estilo de <span className="text-primary italic">Outro Nível</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed">
            A AltGeekStore não é apenas uma loja de roupas. É o ponto de encontro entre a cultura geek, o cyber-estilo e a moda premium. Nascemos da vontade de trazer para o Brasil peças que não apenas vestem, mas expressam a energia de quem vive conectado.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col gap-4 shadow-sm">
            <div className="bg-secondary/10 text-secondary w-12 h-12 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3 className="font-display text-xl font-bold text-on-surface">Curadoria Exclusiva</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Cada peça é pensada para ser única. Desde o bordado minimalista até a estampa que ocupa toda a costa, tudo é feito com propósito.
            </p>
          </div>
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col gap-4 shadow-sm">
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <h3 className="font-display text-xl font-bold text-on-surface">Qualidade Heavyweight</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Trabalhamos com algodão de alta gramatura e técnicas de impressão digital que garantem que sua peça dure por muitas temporadas.
            </p>
          </div>
        </div>

        <section className="bg-on-secondary-fixed text-surface-container-lowest p-10 rounded-[3rem] flex flex-col gap-6 relative overflow-hidden shadow-2xl text-center">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
          <h2 className="font-display text-3xl font-extrabold">Junte-se à nossa guilda</h2>
          <p className="text-sm opacity-80 max-w-md mx-auto">
            Siga-nos nas redes sociais e fique por dentro de todos os "drops" exclusivos e eventos da nossa comunidade.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
              Ver Instagram
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
