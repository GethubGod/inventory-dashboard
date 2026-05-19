/**
 * React Query hooks for inventory operations.
 *
 * Extracts query and mutation logic from the inventory page client
 * for reuse and testability.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import { useApi } from "@/hooks/use-api";

import {
  type InventoryItem,
  type InventoryInsert,
  type InventoryUpdate,
  type SupplierOption,
  toItemCategory,
  toSupplierCategory,
} from "./inventory-types";

// ── Query key constants ─────────────────────────────────────
export const INVENTORY_QUERY_KEY_PREFIX = "inventory-items" as const;
export const SUPPLIERS_QUERY_KEY_PREFIX = "suppliers" as const;

// ── Types ────────────────────────────────────────────────────
export type BulkPatchInput = {
  ids: string[];
  values: InventoryUpdate;
  successMessage: string;
};

// ── Optimistic item builder ──────────────────────────────────

export function buildOptimisticItem(
  payload: InventoryInsert,
  tempId: string,
  orgId: string,
): InventoryItem {
  const name = payload.name?.trim() || "Untitled item";
  const emoji = payload.emoji?.trim() || "📦";
  const category = toItemCategory(
    (payload.item_category as string | null | undefined) ?? payload.category,
  );
  const supplierCategory = toSupplierCategory(
    payload.supplier_category as string | null | undefined,
  );

  return {
    id: tempId,
    orgId,
    name,
    emoji,
    category,
    supplierCategory,
    baseUnit: payload.base_unit?.trim() || "unit",
    packUnit: payload.pack_unit?.trim() || null,
    packSize: typeof payload.pack_size === "number" ? payload.pack_size : null,
    supplierId: payload.supplier_id?.trim() || null,
    active: payload.active ?? true,
    notes: payload.notes?.trim() || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── Hooks ────────────────────────────────────────────────────

export function useInventoryQuery(orgId: string, initialItems: InventoryItem[]) {
  const api = useApi();
  const queryKey = useMemo(() => [INVENTORY_QUERY_KEY_PREFIX, orgId] as const, [orgId]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await api.listInventory({ orgId });
      if (result.error) throw new Error(result.error);
      return result.data?.items ?? [];
    },
    initialData: initialItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { query, queryKey };
}

export function useSuppliersQuery(orgId: string, initialSuppliers: SupplierOption[]) {
  const api = useApi();
  const queryKey = useMemo(() => [SUPPLIERS_QUERY_KEY_PREFIX, orgId] as const, [orgId]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await api.listSuppliers({ orgId });
      if (result.error) throw new Error(result.error);
      return result.data?.suppliers ?? [];
    },
    initialData: initialSuppliers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { query, queryKey };
}

export function useCreateInventoryItem(orgId: string, inventoryQueryKey: readonly string[]) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: { payload: InventoryInsert; tempId: string }) => {
      const result = await api.createInventoryItem({
        orgId: payload.org_id,
        name: payload.name?.trim() || "Untitled",
        emoji: payload.emoji?.trim() || undefined,
        category: ((payload.item_category ?? payload.category) as string) || "dry",
        supplierCategory: payload.supplier_category as string | null | undefined,
        baseUnit: payload.base_unit?.trim() || "unit",
        packUnit: payload.pack_unit?.trim() || undefined,
        packSize: typeof payload.pack_size === "number" ? payload.pack_size : undefined,
        supplierId: payload.supplier_id?.trim() || undefined,
        notes: payload.notes?.trim() || undefined,
        active: payload.active ?? true,
      });

      if (result.error || !result.data) {
        throw new Error(result.error ?? "Unable to create item.");
      }

      return result.data.item;
    },
    onMutate: async ({ payload, tempId }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });
      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      const optimisticItem = buildOptimisticItem(payload, tempId, orgId);
      queryClient.setQueryData<InventoryItem[]>(inventoryQueryKey, [
        optimisticItem,
        ...previousItems,
      ]);
      return { previousItems, tempId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryQueryKey, context.previousItems);
      }
      toast.error("Could not create inventory item.");
    },
    onSuccess: (createdItem, _variables, context) => {
      if (!context?.tempId) return;
      const existingItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        existingItems.map((item) => (item.id === context.tempId ? createdItem : item)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
    },
  });
}

export function useUpdateInventoryItem(orgId: string, inventoryQueryKey: readonly string[]) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: InventoryUpdate }) => {
      const result = await api.updateInventoryItem({
        id,
        orgId,
        name: values.name?.trim(),
        emoji: values.emoji?.trim(),
        category: (values.item_category ?? values.category) as string | undefined,
        supplierCategory: values.supplier_category as string | null | undefined,
        baseUnit: values.base_unit?.trim(),
        packUnit: values.pack_unit as string | null | undefined,
        packSize: values.pack_size as number | null | undefined,
        supplierId: values.supplier_id as string | null | undefined,
        notes: values.notes as string | null | undefined,
        active: values.active ?? undefined,
      });

      if (result.error || !result.data) {
        throw new Error(result.error ?? "Unable to update item.");
      }

      return result.data.item;
    },
    onMutate: async ({ id, values }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });
      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        previousItems.map((item) => {
          if (item.id !== id) return item;

          return {
            ...item,
            name: values.name?.trim() || item.name,
            emoji: values.emoji?.trim() || item.emoji,
            category: toItemCategory(
              (values.item_category as string | undefined) ?? values.category ?? item.category,
            ),
            supplierCategory:
              values.supplier_category === null
                ? null
                : typeof values.supplier_category === "string"
                  ? toSupplierCategory(values.supplier_category)
                  : item.supplierCategory,
            baseUnit: values.base_unit?.trim() || item.baseUnit,
            packUnit:
              typeof values.pack_unit === "string"
                ? values.pack_unit.trim() || null
                : values.pack_unit === null
                  ? null
                  : item.packUnit,
            packSize:
              typeof values.pack_size === "number"
                ? values.pack_size
                : values.pack_size === null
                  ? null
                  : item.packSize,
            supplierId:
              typeof values.supplier_id === "string"
                ? values.supplier_id.trim() || null
                : values.supplier_id === null
                  ? null
                  : item.supplierId,
            notes:
              typeof values.notes === "string"
                ? values.notes.trim() || null
                : values.notes === null
                  ? null
                  : item.notes,
            active: typeof values.active === "boolean" ? values.active : item.active,
            updatedAt: new Date().toISOString(),
          };
        }),
      );

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryQueryKey, context.previousItems);
      }
      toast.error("Could not update item.");
    },
    onSuccess: (updatedItem) => {
      const existingItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        existingItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
    },
  });
}

export function useDeleteInventoryItem(orgId: string, inventoryQueryKey: readonly string[]) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await api.deleteInventoryItem({ id, orgId });
      if (result.error) throw new Error(result.error);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });
      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        previousItems.filter((item) => item.id !== id),
      );
      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryQueryKey, context.previousItems);
      }
      toast.error("Could not delete item.");
    },
    onSuccess: () => {
      toast.success("Item deleted.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
    },
  });
}

export function useBulkUpdateInventory(orgId: string, inventoryQueryKey: readonly string[]) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, values }: BulkPatchInput) => {
      const result = await api.bulkUpdateInventory({
        orgId,
        ids,
        values: {
          category: (values.item_category ?? values.category) as string | undefined,
          itemCategory: values.item_category as string | undefined,
          supplierCategory: values.supplier_category as string | null | undefined,
          supplierId: values.supplier_id as string | null | undefined,
          active: values.active ?? undefined,
        },
      });

      if (result.error) throw new Error(result.error);
      return result.data?.items ?? [];
    },
    onMutate: async ({ ids, values }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });
      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        previousItems.map((item) => {
          if (!ids.includes(item.id)) return item;
          return {
            ...item,
            category: toItemCategory(
              (values.item_category as string | undefined) ?? values.category ?? item.category,
            ),
            supplierCategory:
              values.supplier_category === null
                ? null
                : typeof values.supplier_category === "string"
                  ? toSupplierCategory(values.supplier_category)
                  : item.supplierCategory,
            supplierId:
              typeof values.supplier_id === "string"
                ? values.supplier_id.trim() || null
                : values.supplier_id === null
                  ? null
                  : item.supplierId,
            active: typeof values.active === "boolean" ? values.active : item.active,
            updatedAt: new Date().toISOString(),
          };
        }),
      );

      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryQueryKey, context.previousItems);
      }
      toast.error("Bulk update failed.");
    },
    onSuccess: (updatedRows, variables) => {
      const existingItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      const updatesById = new Map(updatedRows.map((item) => [item.id, item] as const));
      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        existingItems.map((item) => updatesById.get(item.id) ?? item),
      );
      toast.success(variables.successMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
    },
  });
}
