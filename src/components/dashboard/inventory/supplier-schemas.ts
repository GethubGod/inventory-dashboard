/**
 * Supplier form validation schemas.
 *
 * Shared between the supplier create/edit form and any future
 * server-side validation.
 */

import { z } from "zod";

import { SUPPLIER_CATEGORIES } from "./inventory-types";

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.enum(SUPPLIER_CATEGORIES),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[+()-\s.0-9]{7,24}$/.test(value), "Phone number looks invalid"),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Email address looks invalid",
    ),
  notes: z.string().trim().max(1200, "Notes can be at most 1200 characters").optional(),
  active: z.boolean(),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
