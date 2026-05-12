import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const [orders, productsCount, couponsCount] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          totalValue: true,
          paymentMethod: true,
          status: true,
        }
      }),
      prisma.product.count(),
      prisma.coupon.count({
        where: { active: true }
      })
    ]);

    const paidOrders = orders.filter(o => o.status === "PAID");
    const totalSales = paidOrders.reduce((acc, o) => acc + o.totalValue, 0);
    const activeOrders = orders.filter(o => o.status === "PENDING").length;

    return NextResponse.json({
      totalSales,
      activeOrders,
      totalProducts: productsCount,
      activeCoupons: couponsCount,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
