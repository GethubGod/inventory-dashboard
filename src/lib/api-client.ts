/**
 * Typed API client for Supabase Edge Functions.
 *
 * Usage (client components):
 *   const api = useApi();
 *   const { data, error } = await api.listInventory({ orgId });
 *
 * Usage (server components):
 *   const api = await createServerApi();
 *   const { data, error } = await api.listInventory({ orgId });
 */

import type {
  InventoryItem,
  SupplierOption,
} from "@/components/dashboard/inventory/inventory-types";

// ── Response wrapper ──────────────────────────────────────

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// ── Request / response shapes ─────────────────────────────

export type UserContextData = {
  profile: { id: string; fullName: string | null };
  membership: { orgId: string; role: string } | null;
  organization: { id: string; name: string } | null;
};

export type ListInventoryParams = {
  orgId?: string;
  limit?: number;
  offset?: number;
};

export type ListInventoryData = {
  items: InventoryItem[];
  total: number;
  orgId: string;
};

export type CreateInventoryItemParams = {
  orgId: string;
  name: string;
  emoji?: string;
  category: string;
  supplierCategory?: string | null;
  baseUnit: string;
  packUnit?: string | null;
  packSize?: number | null;
  supplierId?: string | null;
  notes?: string | null;
  active?: boolean;
};

export type UpdateInventoryItemParams = {
  id: string;
  orgId: string;
  name?: string;
  emoji?: string;
  category?: string;
  supplierCategory?: string | null;
  baseUnit?: string;
  packUnit?: string | null;
  packSize?: number | null;
  supplierId?: string | null;
  notes?: string | null;
  active?: boolean;
};

export type DeleteInventoryItemParams = {
  id: string;
  orgId: string;
};

export type BulkUpdateInventoryParams = {
  orgId: string;
  ids: string[];
  values: {
    category?: string;
    itemCategory?: string;
    supplierCategory?: string | null;
    supplierId?: string | null;
    active?: boolean;
  };
};

export type ListSuppliersParams = {
  orgId?: string;
  limit?: number;
  offset?: number;
};

export type ListSuppliersData = {
  suppliers: SupplierOption[];
  total: number;
  orgId: string;
};

export type CreateSupplierParams = {
  orgId: string;
  name: string;
  category: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  active?: boolean;
};

export type UpdateSupplierParams = {
  id: string;
  orgId: string;
  name?: string;
  category?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  active?: boolean;
};

export type DeleteSupplierParams = {
  id: string;
  orgId: string;
};

export type AssignSupplierItemsParams = {
  orgId: string;
  supplierId: string | null;
  itemIds: string[];
};

export type CompleteOnboardingParams = {
  organization: {
    name: string;
    type: string;
    timezone: string;
  };
  locations: Array<{ name: string; address: string; phone: string }>;
  invites: Array<{ email: string; role: string }>;
  square: {
    status: string;
    integrationId?: string | null;
    oauthState?: string | null;
  };
};

export type GetIntegrationParams = {
  provider: string;
  oauthState: string;
};

export type GetIntegrationData = {
  integration: { id: string; merchantId: string | null } | null;
};

export type UpdateIntegrationParams = {
  id?: string;
  oauthState?: string;
  orgId: string;
  status: string;
};

export type SaveSquareTokensParams = {
  oauthState: string;
  merchantId?: string | null;
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiresAt?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type GetOverviewDataParams = {
  orgId?: string;
};

// The overview response mirrors the props of <OverviewDashboard>
export type OverviewData = {
  performanceTitle: string;
  performanceFilters: Array<{
    id: string;
    label: string;
    defaultValue: string;
    options: Array<{ value: string; label: string }>;
  }>;
  chartData: Array<{ label: string; current: number; prior: number }>;
  primaryKpi: { id: string; label: string; value: string; unavailable?: boolean };
  secondaryKpis: Array<{
    id: string;
    label: string;
    value: string;
    unavailable?: boolean;
  }>;
  offerDescription: string;
  offerActionLabel: string;
  offerActionHref: string;
  syncStatusLabel: string;
  syncStatusTone: string;
  syncValue: string;
  quickActions: Array<{ label: string; href: string; primary?: boolean }>;
  latestActivity: string | null;
  topAttention: string | null;
};

// ── Core fetch ────────────────────────────────────────────

function getBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  return `${url}/functions/v1`;
}

async function apiFetch<T>(
  functionName: string,
  token: string | null,
  options?: { method?: string; body?: unknown },
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}/${functionName}`, {
      method: options?.method ?? "POST",
      headers,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    return { data: null, error: "Network error — the service may be temporarily unavailable" };
  }

  let json: { data: T | null; error: string | null };
  try {
    json = await response.json();
  } catch {
    return {
      data: null,
      error: `Unexpected response (${response.status})`,
    };
  }

  if (!response.ok || json.error) {
    if (response.status === 401) {
      return {
        data: null,
        error: "Session expired. Please sign in again.",
      };
    }

    return {
      data: null,
      error: json.error ?? `Request failed (${response.status})`,
    };
  }

  return { data: json.data, error: null };
}

// ── Client factory ────────────────────────────────────────

type TokenGetter = () => Promise<string | null>;

export function createApiClient(getToken: TokenGetter) {
  async function req<T>(fn: string, opts?: { method?: string; body?: unknown }) {
    const token = await getToken();
    return apiFetch<T>(fn, token, opts);
  }

  return {
    // User context
    getUserContext: () =>
      req<UserContextData>("v1-get-user-context", { method: "GET" }),

    // Inventory
    listInventory: (params: ListInventoryParams) =>
      req<ListInventoryData>("v1-list-inventory", { body: params }),

    createInventoryItem: (params: CreateInventoryItemParams) =>
      req<{ item: InventoryItem }>("v1-create-inventory-item", { body: params }),

    updateInventoryItem: (params: UpdateInventoryItemParams) =>
      req<{ item: InventoryItem }>("v1-update-inventory-item", { body: params }),

    deleteInventoryItem: (params: DeleteInventoryItemParams) =>
      req<{ success: boolean }>("v1-delete-inventory-item", { body: params }),

    bulkUpdateInventory: (params: BulkUpdateInventoryParams) =>
      req<{ items: InventoryItem[] }>("v1-bulk-update-inventory", { body: params }),

    // Suppliers
    listSuppliers: (params: ListSuppliersParams) =>
      req<ListSuppliersData>("v1-list-suppliers", { body: params }),

    createSupplier: (params: CreateSupplierParams) =>
      req<{ supplier: SupplierOption }>("v1-create-supplier", { body: params }),

    updateSupplier: (params: UpdateSupplierParams) =>
      req<{ supplier: SupplierOption }>("v1-update-supplier", { body: params }),

    deleteSupplier: (params: DeleteSupplierParams) =>
      req<{ success: boolean }>("v1-delete-supplier", { body: params }),

    assignSupplierItems: (params: AssignSupplierItemsParams) =>
      req<{ success: boolean; count: number }>("v1-assign-supplier-items", {
        body: params,
      }),

    // Onboarding
    completeOnboarding: (params: CompleteOnboardingParams) =>
      req<{ orgId: string }>("v1-complete-onboarding", { body: params }),

    // Integrations
    getIntegration: (params: GetIntegrationParams) =>
      req<GetIntegrationData>("v1-get-integration", { body: params }),

    updateIntegration: (params: UpdateIntegrationParams) =>
      req<{ success: boolean }>("v1-update-integration", { body: params }),

    saveSquareTokens: (params: SaveSquareTokensParams) =>
      req<{ success: boolean }>("v1-save-square-tokens", { body: params }),

    // Overview
    getOverviewData: (params: GetOverviewDataParams) =>
      req<OverviewData>("v1-get-overview-data", { body: params }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
