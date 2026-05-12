import axios from "axios";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.NEXT_PUBLIC_ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";

const asaasClient = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    access_token: ASAAS_API_KEY,
    "Content-Type": "application/json",
  },
});

export interface AsaasCustomer {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasCreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasCreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  phone: string;
}

export interface AsaasPayment {
  customer: string;
  billingType: "PIX" | "BOLETO" | "CREDIT_CARD";
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  postalService?: boolean;
  creditCard?: AsaasCreditCard;
  creditCardHolderInfo?: AsaasCreditCardHolderInfo;
}

export const createCustomer = async (customerData: AsaasCustomer) => {
  try {
    const response = await asaasClient.post("/customers", customerData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating Asaas customer:", error.response?.data || error.message);
    throw error;
  }
};

export const createPayment = async (paymentData: AsaasPayment) => {
  try {
    const response = await asaasClient.post("/payments", paymentData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating Asaas payment:", error.response?.data || error.message);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId: string) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Asaas payment status:", error.response?.data || error.message);
    throw error;
  }
};

export const getPixQrCode = async (paymentId: string) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Asaas PIX QR Code:", error.response?.data || error.message);
    throw error;
  }
};
