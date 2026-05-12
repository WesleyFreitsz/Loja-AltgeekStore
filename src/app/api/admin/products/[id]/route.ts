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

    let specsString = data.specs;
    if (Array.isArray(data.specs)) {
      specsString = JSON.stringify(data.specs);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        specs: specsString,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
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
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 });
  }
}
