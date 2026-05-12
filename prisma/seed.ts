import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || `file:${dbPath}`
});
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Moletom Canguru Beyond The Journey PRETO - Unissex",
    description: "Moletom premium feito em fio 3 cabos, 50% algodão e 50% poliéster. Quentinho e confortável para o inverno geek.",
    price: 359.90,
    image: "https://acdn-us.mitiendanube.com/stores/001/078/806/products/01-807cdb791107f5003717722110980723-640-0.webp",
    category: "Moletons",
    isPromotion: false,
    specs: JSON.stringify(["50% Algodão / 50% Poliéster", "Fio 3 cabos", "Modelagem Canguru", "Estampa Silk Screen"])
  },
  {
    name: "Moletom Canguru Eevee's Home PRETO - Unissex",
    description: "Inspirado na casa das Eeveelutions. Tecido de alta qualidade para máximo conforto.",
    price: 299.90,
    oldPrice: 359.90,
    isPromotion: true,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/01-1d1c8bf2b392fa9e6717751545995617-640-0.webp",
    category: "Moletons",
    specs: JSON.stringify(["50% Algodão / 50% Poliéster", "Estampa Exclusiva", "Toque Macio", "Acabamento Premium"])
  },
  {
    name: "Camiseta The Sun PRETO - Feminina",
    description: "Camiseta em meia malha 100% algodão, toque suave e caimento perfeito. Inspirada no arcano O Sol.",
    price: 89.90,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/01-f83b389a96c248c1db17734209815876-640-0.webp",
    category: "Camisetas",
    isPromotion: false,
    specs: JSON.stringify(["100% Algodão Penteado", "Corte Feminino", "Gola Canelada", "Reforço de Ombro"])
  },
  {
    name: "Camiseta The Stark PRETO - Unissex",
    description: "Honre a casa Stark com esta camiseta minimalista e elegante. 100% algodão premium.",
    price: 69.90,
    oldPrice: 89.90,
    isPromotion: true,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/01-82c591d0571e11b5fd17728207040350-640-0.webp",
    category: "Camisetas",
    specs: JSON.stringify(["100% Algodão", "Unissex", "Alta Durabilidade", "Estampa Digital"])
  },
  {
    name: "Camiseta Oversized The Magician PRETO - Unissex",
    description: "Corte moderno oversized em tecido suedine. Estampa inspirada no tarô com detalhes místicos.",
    price: 109.90,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/01-945a0d8a7904486a8017772425164370-640-0.webp",
    category: "Camisetas",
    isPromotion: false,
    specs: JSON.stringify(["Tecido Suedine 100% Algodão", "Modelagem Boxy", "Gola 3cm", "Gramatura Heavyweight"])
  },
  {
    name: "Camiseta The Creation of Pspsps PRETO - Unissex",
    description: "Uma paródia felina da obra de Michelangelo. Perfeita para amantes de gatos e arte.",
    price: 89.90,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/01-5d6eb244a65e804c9e17713408567987-640-0.webp",
    category: "Camisetas",
    isPromotion: false,
    specs: JSON.stringify(["100% Algodão", "Silk Screen de Alta Qualidade", "Modelagem Unissex", "Toque Macio"])
  },
  {
    name: "Meia Cats and Their Mood AMARELO - Unissex",
    description: "Meias geeks fofinhas que calçam do 33 ao 40. Conforto e estilo para os seus pés.",
    price: 39.90,
    image: "http://acdn-us.mitiendanube.com/stores/001/078/806/products/0171-8c2d219e6652b3bb4716499592668275-640-0.webp",
    category: "Acessórios",
    isPromotion: false,
    specs: JSON.stringify(["70% Algodão / 19% Poliamida / 6% Elastano", "Tamanho 33-40", "Cano Alto", "Estampa Jacquard"])
  }
];


const banners = [
  {
    title: "Cupom de Inauguração",
    subtitle: "BEM-VINDO À ALTGEEKSTORE",
    image: "/banner2.png",
    link: "/catalogo",
    order: 1
  },
  {
    title: "Promoção de Inverno",
    subtitle: "2 Moletons pelo preço de 1",
    image: "/banner3.png",
    link: "/catalogo",
    order: 2
  },
  {
    title: "Frete Grátis",
    subtitle: "Aproveite em todo o site",
    image: "/banner1.png",
    link: "/catalogo",
    order: 3
  }
];

const coupons = [
  {
    code: "GEEK10",
    discountType: "PERCENTAGE",
    value: 10,
    minPurchase: 100,
    active: true
  },
  {
    code: "BEMVINDO",
    discountType: "FIXED",
    value: 20,
    minPurchase: 50,
    active: true
  }
];

async function main() {
  console.log("Iniciando seed...");
  
  // Limpar dados existentes para evitar duplicatas
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  
  // Criar Usuário Admin
  await prisma.user.create({
    data: {
      email: "admin123@gmail.com",
      name: "Admin AltGeek",
      password: "senha123", // Em um app real, usar hash (bcrypt)
      isAdmin: true
    }
  });

  // Criar Produtos
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Criar Banners
  for (const banner of banners) {
    await prisma.banner.create({
      data: banner
    });
  }

  // Criar Cupons
  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: coupon
    });
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

