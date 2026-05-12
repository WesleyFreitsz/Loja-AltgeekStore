import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Cupom inválido" }, { status: 404 });
    }

    if (!coupon.active) {
      return NextResponse.json({ error: "Este cupom não está mais ativo" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Este cupom expirou" }, { status: 400 });
    }

    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Compra mínima de R$ ${coupon.minPurchase.toFixed(2).replace(".", ",")} necessária para este cupom` 
      }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Erro ao validar cupom" }, { status: 500 });
  }
}
