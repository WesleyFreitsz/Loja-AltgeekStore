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

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...data,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar banner" }, { status: 500 });
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
    await prisma.banner.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Banner excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir banner" }, { status: 500 });
  }
}
