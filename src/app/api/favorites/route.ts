import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "UserId and ProductId are required" }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
      },
      update: {}, // No changes if already exists
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Favorite POST error:", error);
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "UserId and ProductId are required" }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return NextResponse.json({ message: "Favorite removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
