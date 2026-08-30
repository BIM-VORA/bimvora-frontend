export type CheckoutItem = {
  productId: string;
  name: string;
  sku: string;
  unitPriceCents: number;
  quantity: number;
};

export type CreateCheckoutSessionInput = {
  orderId: string;
  customerEmail: string;
  currency: "EUR";
  items: CheckoutItem[];
  successUrl: string;
  cancelUrl: string;
};

export type CreateCheckoutSessionResult = {
  redirectUrl: string;
  externalReference: string;
};

export type PaymentWebhookEvent = {
  provider: string;
  eventType: string;
  externalId: string | null;
  orderId: string | null;
  status: "paid" | "failed" | "refunded" | "ignored";
  rawPayload: unknown;
};

export type RefundInput = {
  orderId: string;
  externalReference: string;
  amountCents?: number;
};

/**
 * Payment gateway adapter. Phase 1 ships a noop implementation.
 * Integrate a real provider in Phase 2 without changing checkout UI contracts.
 */
export interface PaymentProvider {
  readonly id: string;
  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult>;
  handleWebhook(
    request: Request,
  ): Promise<PaymentWebhookEvent>;
  refund(input: RefundInput): Promise<void>;
}

export class PaymentNotConfiguredError extends Error {
  constructor(message = "No payment provider is configured.") {
    super(message);
    this.name = "PaymentNotConfiguredError";
  }
}
