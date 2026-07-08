export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Mock API client that resolves with empty success to prevent build errors
  // since we reverted from a custom backend to client-side supabase for Auth.
  return {
    status: 'success',
    data: [],
    orders: [],
    products: [],
    categories: [],
    coupons: [],
    shipping_zones: [],
    store_info: { title: 'TRAIVO' },
    store: { store_slug: 'demo' },
    plans: []
  } as unknown as T;
}
