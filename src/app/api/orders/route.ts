import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email não informado" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        customerEmail: email,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
