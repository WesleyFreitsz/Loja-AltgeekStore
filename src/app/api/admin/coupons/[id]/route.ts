import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        value: Number(data.value),
        minPurchase: Number(data.minPurchase) || 0,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar cupom" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.coupon.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Cupom excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir cupom" }, { status: 500 });
  }
}
