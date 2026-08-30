import {
  PaymentNotConfiguredError,
  type PaymentProvider,
} from "@/lib/payments/provider";

export class NoopPaymentProvider implements PaymentProvider {
  readonly id = "noop";

  async createCheckoutSession(): Promise<never> {
    throw new PaymentNotConfiguredError(
      "Checkout is not available yet. A payment provider will be connected in a later phase.",
    );
  }

  async handleWebhook(): Promise<never> {
    throw new PaymentNotConfiguredError(
      "Payment webhooks are not configured.",
    );
  }

  async refund(): Promise<never> {
    throw new PaymentNotConfiguredError(
      "Refunds are not available until a payment provider is connected.",
    );
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new NoopPaymentProvider();
}
