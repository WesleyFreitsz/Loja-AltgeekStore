import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SECRET = process.env.JWT_SECRET 

export function signToken(payload: any) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 })).toString("base64url"); // 1 dia de duração
  const signature = crypto.createHmac("sha256", SECRET).update(`${header}.${payloadStr}`).digest("base64url");
  return `${header}.${payloadStr}.${signature}`;
}

export function verifyToken(token: string) {
  try {
    const [header, payloadStr, signature] = token.split(".");
    if (!header || !payloadStr || !signature) return null;

    const validSignature = crypto.createHmac("sha256", SECRET).update(`${header}.${payloadStr}`).digest("base64url");
    if (signature !== validSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Date.now()) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

export async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || !user.isAdmin) return null;

  return user;
}
