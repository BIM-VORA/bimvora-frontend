export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  priceCents: number;
};

export type CreateOrderPayload = {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerCompany?: string;
  country: string;
  items: OrderItem[];
  subtotalCents: number;
  currency: string;
};

export type CreateOrderResponse = {
  orderId: string;
  status: string;
  message: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.bimvora.com";

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<CreateOrderResponse>;
}
