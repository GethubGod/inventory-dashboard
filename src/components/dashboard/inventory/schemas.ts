/**
 * Inventory form validation schemas.
 *
 * Shared between the inventory create/edit form and any future
 * server-side validation. Keeps a single source of truth for
 * field constraints.
 */

import { z } from "zod";

import { ITEM_CATEGORIES, SUPPLIER_CATEGORIES } from "./inventory-types";

export const inventoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  emoji: z.string().trim().max(16, "Keep emoji short").optional(),
  category: z.enum(ITEM_CATEGORIES),
  supplierCategory: z.enum(SUPPLIER_CATEGORIES).optional().or(z.literal("")),
  baseUnit: z.string().trim().min(1, "Base unit is required"),
  packUnit: z.string().trim().optional(),
  packSize: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) <= 1_000_000),
      "Pack size must be greater than 0",
    ),
  supplierId: z
    .string()
    .optional()
    .refine((value) => !value || /^[a-f0-9-]{32,36}$/i.test(value), "Invalid supplier selection"),
  notes: z.string().trim().max(1200, "Notes can be at most 1200 characters").optional(),
  active: z.boolean(),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;
