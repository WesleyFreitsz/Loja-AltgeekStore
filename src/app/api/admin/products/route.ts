import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

// GET: Listar todos os produtos
export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// POST: Criar novo produto
export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const data = await request.json();
    
    // Validar se specs é uma string JSON válida se for array, ou transformar em string
    let specsString = data.specs;
    if (Array.isArray(data.specs)) {
      specsString = JSON.stringify(data.specs);
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        specs: specsString,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
