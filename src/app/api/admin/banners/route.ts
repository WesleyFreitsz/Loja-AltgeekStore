import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar banners" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const data = await request.json();
    const banner = await prisma.banner.create({
      data: {
        ...data,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar banner" }, { status: 500 });
  }
}
