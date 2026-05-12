import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const data = await request.json();
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        value: Number(data.value),
        minPurchase: Number(data.minPurchase) || 0,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 });
  }
}
