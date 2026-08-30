import { getPaymentProvider } from "@/lib/payments/noop";
import type { PaymentProvider } from "@/lib/payments/provider";

export type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentWebhookEvent,
  RefundInput,
} from "@/lib/payments/provider";
export { PaymentNotConfiguredError } from "@/lib/payments/provider";
export { getPaymentProvider, NoopPaymentProvider } from "@/lib/payments/noop";

export function requirePaymentProvider(): PaymentProvider {
  return getPaymentProvider();
}
