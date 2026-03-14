// ── Inventory ────────────────────────────────────────────

export interface ListInventoryRequest {
  orgId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateInventoryItemRequest {
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
}

export interface UpdateInventoryItemRequest {
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
}

export interface DeleteInventoryItemRequest {
  id: string;
  orgId: string;
}

export interface BulkUpdateInventoryRequest {
  orgId: string;
  ids: string[];
  values: {
    category?: string;
    itemCategory?: string;
    supplierCategory?: string | null;
    supplierId?: string | null;
    active?: boolean;
  };
}

// ── Suppliers ────────────────────────────────────────────

export interface ListSuppliersRequest {
  orgId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateSupplierRequest {
  orgId: string;
  name: string;
  category: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  active?: boolean;
}

export interface UpdateSupplierRequest {
  id: string;
  orgId: string;
  name?: string;
  category?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  active?: boolean;
}

export interface DeleteSupplierRequest {
  id: string;
  orgId: string;
}

export interface AssignSupplierItemsRequest {
  orgId: string;
  supplierId: string | null;
  itemIds: string[];
}

// ── Onboarding ───────────────────────────────────────────

export interface CompleteOnboardingRequest {
  organization: {
    name: string;
    type: string;
    timezone: string;
  };
  locations: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  invites: Array<{
    email: string;
    role: string;
  }>;
  square: {
    status: string;
    integrationId?: string | null;
    oauthState?: string | null;
  };
}

// ── Integrations ─────────────────────────────────────────

export interface GetIntegrationRequest {
  provider: string;
  oauthState: string;
}

export interface UpdateIntegrationRequest {
  id?: string;
  oauthState?: string;
  orgId: string;
  status: string;
}

export interface SaveSquareTokensRequest {
  oauthState: string;
  merchantId?: string | null;
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiresAt?: string | null;
  metadata?: Record<string, unknown> | null;
}

// ── Overview ─────────────────────────────────────────────

export interface GetOverviewDataRequest {
  orgId?: string;
}

// ── Normalized response shapes ───────────────────────────
// These match the camelCase shapes the website already uses.

export interface InventoryItemDTO {
  id: string;
  orgId: string;
  name: string;
  emoji: string;
  category: string;
  supplierCategory: string | null;
  baseUnit: string;
  packUnit: string | null;
  packSize: number | null;
  supplierId: string | null;
  active: boolean;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SupplierDTO {
  id: string;
  name: string;
  category: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
