import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, userId, productId } = body;

    if (!rating || !comment || !userId || !productId) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        userId,
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId é obrigatório" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Erro ao buscar avaliações" }, { status: 500 });
  }
}
