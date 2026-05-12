import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Em um app real, usar bcrypt.compare
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
