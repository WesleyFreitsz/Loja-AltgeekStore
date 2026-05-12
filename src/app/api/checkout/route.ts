import { NextResponse } from "next/server";
import { createCustomer, createPayment, getPixQrCode } from "@/lib/asaas";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, payment, items, userId } = body;

    // 1. Create or Find Customer in Asaas
    // In a production app, you might want to search for existing customers by CPF/CNPJ
    const asaasCustomer = await createCustomer({
      name: customer.name,
      email: customer.email,
      cpfCnpj: customer.cpfCnpj.replace(/\D/g, ""),
      mobilePhone: customer.phone?.replace(/\D/g, "") || "",
      postalCode: customer.postalCode.replace(/\D/g, ""),
      address: customer.address,
      addressNumber: customer.addressNumber,
      province: customer.province,
    });

    // 2. Create Payment in Asaas
    const paymentData: any = {
      customer: asaasCustomer.id,
      billingType: payment.method, // PIX, BOLETO, CREDIT_CARD
      value: payment.total,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0], // 3 dias
      description: `Pedido AltGeekStore - ${items.map((i: any) => i.name).join(", ")}`,
      externalReference: `ORDER_${Date.now()}`,
    };

    if (payment.method === "CREDIT_CARD") {
      const [expiryMonth, expiryYear] = customer.cardExpiry.split("/");
      paymentData.creditCard = {
        holderName: customer.cardHolder,
        number: customer.cardNumber.replace(/\s/g, ""),
        expiryMonth: expiryMonth.trim(),
        expiryYear: "20" + expiryYear.trim(),
        ccv: customer.cardCvv,
      };
      paymentData.creditCardHolderInfo = {
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj.replace(/\D/g, ""),
        postalCode: customer.postalCode.replace(/\D/g, ""),
        addressNumber: customer.addressNumber,
        phone: customer.phone?.replace(/\D/g, "") || "",
      };
    }

    const asaasPayment = await createPayment(paymentData);

    let pixData = null;
    if (payment.method === "PIX") {
      pixData = await getPixQrCode(asaasPayment.id);
    }

    // 3. Save Order in Database
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        customerName: customer.name,
        customerEmail: customer.email,
        customerCpfCnpj: customer.cpfCnpj,
        customerPhone: customer.phone || "",
        postalCode: customer.postalCode,
        address: customer.address,
        addressNumber: customer.addressNumber,
        province: customer.province,
        totalValue: payment.total,
        status: "PENDING",
        paymentMethod: payment.method,
        asaasPaymentId: asaasPayment.id,
        asaasInvoiceUrl: asaasPayment.invoiceUrl,
        pixPayload: pixData?.payload || null,
        pixEncodedImage: pixData?.encodedImage || null,
        items: {
          create: items.map((item: any) => ({
            productId: String(item.id),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentId: asaasPayment.id,
      invoiceUrl: asaasPayment.invoiceUrl,
      pix: pixData,
    });
  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
