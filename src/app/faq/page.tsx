import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Qual o prazo de entrega?",
    a: "Nosso prazo médio é de 5 a 12 dias úteis, dependendo da sua região. Após a confirmação do pagamento, levamos até 3 dias úteis para preparar e postar seu pedido."
  },
  {
    q: "Como acompanho meu pedido?",
    a: "Assim que seu pedido for postado, você receberá um código de rastreamento por e-mail. Você pode usá-lo no site dos Correios ou da transportadora parceira."
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Aceitamos PIX (com 5% de desconto), Boleto Bancário e Cartão de Crédito em até 12x sem juros. Todos os pagamentos são processados com segurança pelo Asaas."
  },
  {
    q: "Posso trocar meu produto?",
    a: "Sim! Você tem até 7 dias após o recebimento para solicitar a troca ou devolução se o produto não servir ou se você se arrepender da compra."
  },
  {
    q: "As camisetas encolhem na lavagem?",
    a: "Nossas camisetas são pré-encolhidas em fábrica, mas como são de 100% algodão, podem ter um encolhimento residual mínimo (menos de 2%) se lavadas em água quente ou secas na máquina."
  }
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
            Dúvidas <span className="text-primary italic">Frequentes</span>
          </h1>
          <p className="text-on-surface-variant font-body text-lg">
            Encontre respostas rápidas para as perguntas mais comuns da nossa comunidade.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-surface-container-low border border-outline-variant rounded-3xl overflow-hidden transition-all duration-300 open:shadow-md open:bg-surface-container-lowest">
              <summary className="list-none flex justify-between items-center p-6 cursor-pointer select-none">
                <span className="font-display font-bold text-lg text-on-surface pr-4">{faq.q}</span>
                <ChevronDown className="w-6 h-6 text-outline group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/30 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <section className="mt-12 p-8 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/30 text-center flex flex-col gap-4">
          <h3 className="font-display font-bold text-xl">Não encontrou o que procurava?</h3>
          <p className="text-sm text-on-surface-variant">Nossa equipe de suporte humano está pronta para te ajudar via chat ou e-mail.</p>
          <div className="flex justify-center gap-4 mt-2">
            <button className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Abrir Ticket de Suporte
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
