import { requestJson } from '@/api/client';

export interface PlaceOrderRequest {
  storeId: string;
  customerName: string;
  customerPhone: string;
}

export interface OrderResponse {
  id: string;
  orderCode: string;
  status: string;
  subtotal: number;
  total: number;
}

interface CartResponse {
  id: string;
  status: string;
  items: unknown[];
}

function getGuestToken(): string {
  const key = 'creme-guest-token';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const token = crypto.randomUUID();
  window.localStorage.setItem(key, token);
  return token;
}

export async function placeCustomOrder(
  selection: Record<string, unknown>,
  quantity: number,
  request: PlaceOrderRequest,
): Promise<OrderResponse> {
  const guestToken = getGuestToken();
  const headers = { 'Content-Type': 'application/json', 'X-Guest-Token': guestToken };
  await requestJson<CartResponse>('/api/cart/items', {
    method: 'POST',
    headers,
    body: JSON.stringify({ customSelection: selection, quantity }),
  });
  return requestJson<OrderResponse>('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });
}
