# AltGeekStore 🛍️
E-commerce fullstack voltado para o universo geek e cultura pop, desenvolvido com Next.js 16 e Prisma.
🔗 **Deploy no ar:** [loja-altgeek-store.vercel.app](https://loja-altgeek-store.vercel.app/)
---
## 💡 O que o projeto resolve
A AltGeekStore foi construída para simular um fluxo de compras completo do mundo real: catálogo dinâmico de produtos, navegação touch-friendly no mobile, controle de estoque e cobrança automatizada via gateway de pagamentos.
## 🛠️ Tecnologias Utilizadas
- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Framer Motion, Lucide React
- **Backend & Dados:** Next.js Route Handlers, Prisma ORM, SQLite
- **Pagamentos:** Integração com API da Asaas para geração de cobranças e webhooks
## ⚡ Principais Funcionalidades
- **Navegação Mobile:** Banners com suporte a gestos de arrasto (swipe) e layout responsivo.
- **Fluxo de Carrinho e Checkout:** Aplicação de cupons dinâmicos e validação de dados em tempo real.
- **Painel Administrativo:** Interface para controle de estoque, criação de promoções e acompanhamento de pedidos.
- **Webhooks de Pagamento:** Confirmação assíncrona de status do pedido.
## 🚀 Como Executar Localmente
```bash
# Clone o repositório
git clone https://github.com/WesleyFreitsz/Loja-AltgeekStore.git
# Instale as dependências
npm install
# Execute as migrações do banco de dados
npx prisma migrate dev
# Inicie o servidor de desenvolvimento
npm run dev
