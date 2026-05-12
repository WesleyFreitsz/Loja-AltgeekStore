import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, payment } = body;

    console.log(`Asaas Webhook received: ${event}`, payment.id);

    // Events to handle:
    // PAYMENT_RECEIVED - Payment confirmed
    // PAYMENT_CONFIRMED - For credit cards, confirmed but not necessarily received yet
    // PAYMENT_OVERDUE - Expired
    // PAYMENT_DELETED - Cancelled

    let status = "PENDING";
    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      status = "PAID";
    } else if (event === "PAYMENT_OVERDUE") {
      status = "EXPIRED";
    } else if (event === "PAYMENT_DELETED") {
      status = "CANCELLED";
    } else if (event === "PAYMENT_REFUNDED") {
      status = "REFUNDED";
    }

    if (status !== "PENDING") {
      await prisma.order.update({
        where: { asaasPaymentId: payment.id },
        data: { status },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Asaas Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
