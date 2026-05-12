import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}
