# 🛒 AltGeekStore - E-commerce Premium Geek

A **AltGeekStore** é uma plataforma de e-commerce de última geração, desenvolvida para proporcionar uma experiência de compra fluida, visualmente impactante e tecnicamente robusta para o público entusiasta da cultura geek.

🚀 **Deploy Oficial:** [loja-altgeek-store.vercel.app](https://loja-altgeek-store.vercel.app/)

---

## 🛠️ Tech Stack & Arquitetura

O projeto foi construído utilizando as ferramentas mais modernas do desenvolvimento web para garantir performance e escalabilidade:

- **Core**: [Next.js 16](https://nextjs.org/) (App Router) com o motor de build **Turbopack**.
- **Backend & Database**: 
  - [Prisma ORM](https://www.prisma.io/) para modelagem de dados.
  - **SQLite** para armazenamento local ágil.
  - Endpoints de API estruturados para operações complexas de checkout e administração.
- **Frontend & UI**:
  - [Tailwind CSS](https://tailwindcss.com/) para estilização utilitária e design responsivo.
  - [Framer Motion](https://www.framer.com/motion/) para animações de alta performance e suporte a gestos (swipe).
  - [Lucide React](https://lucide.dev/) para uma biblioteca de ícones consistente.
- **Integrações**: 
  - Gateway de Pagamento **Asaas API** para processamento de cobranças.

---

## 🎯 Objetivo do Projeto

A AltGeekStore não é apenas uma vitrine, mas um ecossistema completo de vendas que resolve:
- **Exposição de Marca**: Banners interativos que capturam a atenção e direcionam o tráfego.
- **Conversão**: Fluxo de checkout otimizado com suporte a cupons dinâmicos.
- **Gerenciamento**: Painel administrativo integrado para controle total de estoque, promoções e pedidos.

---

## ✨ Destaques de Desenvolvimento

### 🚩 Banner Experience (Mobile-First)
Implementamos um sistema de banner que redefine a interatividade:
- **Swipe Navigation**: Gestos naturais de arrastar para navegar entre promoções.
- **Zonas de Clique Inteligentes**: Separação entre a área de "navegação" (blur lateral) e a área de "ação" (imagem central vinculada ao produto).
- **Aesthetic Blur Fill**: Técnica de design que preenche o container com um fundo desfocado baseado na imagem, mantendo a harmonia visual em qualquer proporção de tela.

### 💰 Sistema de Checkout e Cupons
- Validação assíncrona de cupons de desconto.
- Cálculo dinâmico de frete e taxas.
- Integração robusta com webhooks para confirmação de pagamento.

### 🛡️ Dashboard Administrativo Fullstack
Uma central de comando que permite:
- Gerenciar produtos, categorias e estoque.
- Criar e monitorar campanhas promocionais.
- Visualizar métricas de vendas em tempo real.

---

## 📂 Estrutura de Pastas

```text
├── prisma/               # Configurações do banco de dados
│   ├── schema.prisma     # Modelagem de dados (User, Product, Order, Banner, etc.)
│   └── seed.ts           # Script de população para testes e produção
├── public/               # Ativos estáticos e banners promocionais
├── src/
│   ├── app/              # Arquitetura App Router (Next.js)
│   │   ├── admin/        # Interface de administração
│   │   ├── api/          # Backend (Routes handlers para checkout, cupons, etc.)
│   │   ├── catalogo/     # Listagem e filtros de produtos
│   │   ├── checkout/     # Fluxo de finalização de compra
│   │   ├── login/        # Sistema de autenticação
│   │   └── produto/      # Páginas dinâmicas de detalhes do produto
│   ├── components/       # Componentes React (Banner, Header, Footer, Cards)
│   ├── hooks/            # Custom hooks para lógica compartilhada
│   └── lib/              # Instâncias de bibliotecas (Prisma, Asaas Client)
├── tailwind.config.ts    # Tokens de design e customização de cores
└── next.config.ts        # Otimizações de imagem e roteamento
```

---

## 🚀 Como Iniciar

1. **Dependências**:
   ```bash
   npm install
   ```

2. **Banco de Dados**:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

3. **Execução**:
   ```bash
   npm run dev
   ```

---

*Projeto desenvolvido com foco em UI/UX Premium e Performance.*

