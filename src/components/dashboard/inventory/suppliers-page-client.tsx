"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CircleDot,
  Link2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { InventorySectionTabs } from "@/components/dashboard/inventory/inventory-section-tabs";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  SUPPLIER_CATEGORIES,
  labelForCategory,
  labelForSupplierCategory,
  normalizeInventoryRow,
  normalizeSupplierRow,
  type InventoryItem,
  type InventoryRow,
  type SupplierCategory,
  type SupplierOption,
  type SupplierRow,
} from "./inventory-types";

const INVENTORY_QUERY_KEY_PREFIX = "inventory-items";
const SUPPLIERS_QUERY_KEY_PREFIX = "suppliers";

const supplierCategoryBadgeClassMap: Record<SupplierCategory, string> = {
  fish_supplier:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300",
  main_distributor:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  asian_market:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300",
};

const supplierFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.enum(SUPPLIER_CATEGORIES),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value ||
        /^[+()\-\s.0-9]{7,24}$/.test(value),
      "Phone number looks invalid",
    ),
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

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

type SupplierTableRow = SupplierOption & {
  itemsCount: number;
};

type SuppliersPageClientProps = {
  orgId: string;
  initialSuppliers: SupplierOption[];
  initialItems: InventoryItem[];
};

type SupplierSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSupplier: SupplierOption | null;
  onSubmit: (values: SupplierFormValues) => Promise<void>;
  isPending: boolean;
};

function defaultSupplierFormValues(supplier: SupplierOption | null): SupplierFormValues {
  if (!supplier) {
    return {
      name: "",
      category: "main_distributor",
      phone: "",
      email: "",
      notes: "",
      active: true,
    };
  }

  return {
    name: supplier.name,
    category: supplier.category ?? "main_distributor",
    phone: supplier.phone ?? "",
    email: supplier.email ?? "",
    notes: supplier.notes ?? "",
    active: supplier.active,
  };
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString();
}

function SortHeader({ column, title }: { column: Column<SupplierTableRow, unknown>; title: string }) {
  const sortingState = column.getIsSorted();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      onClick={() => column.toggleSorting(sortingState === "asc")}
    >
      <span>{title}</span>
      {sortingState === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sortingState === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-65" />
      )}
    </button>
  );
}

function SupplierSheet({
  open,
  onOpenChange,
  editingSupplier,
  onSubmit,
  isPending,
}: SupplierSheetProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: defaultSupplierFormValues(editingSupplier),
  });

  useEffect(() => {
    form.reset(defaultSupplierFormValues(editingSupplier));
  }, [editingSupplier, form, open]);

  async function handleFormSubmit(values: SupplierFormValues) {
    await onSubmit(values);
    form.reset(defaultSupplierFormValues(null));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-slate-200 p-0 sm:max-w-xl dark:border-slate-800">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {editingSupplier ? "Edit supplier" : "Add supplier"}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
            {editingSupplier
              ? "Update supplier details and status."
              : "Add a new supplier for your organization."}
          </SheetDescription>
        </div>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="supplier-name">Name</Label>
            <Input id="supplier-name" placeholder="Pacific Seafood Co" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) =>
                  form.setValue("category", value as SupplierCategory, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {labelForSupplierCategory(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-phone">Phone</Label>
              <Input id="supplier-phone" placeholder="(555) 555-0100" {...form.register("phone")} />
              {form.formState.errors.phone ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-email">Email</Label>
            <Input id="supplier-email" placeholder="orders@supplier.com" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-notes">Notes</Label>
            <Textarea
              id="supplier-notes"
              rows={5}
              placeholder="Delivery windows, payment terms, order minimums..."
              {...form.register("notes")}
            />
            {form.formState.errors.notes ? (
              <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.notes.message}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Supplier status</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inactive suppliers remain available in history but hidden from default assignment flows.
              </p>
            </div>
            <Switch
              checked={form.watch("active")}
              onCheckedChange={(checked) => form.setValue("active", checked, { shouldDirty: true })}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0f172a] hover:bg-slate-800" disabled={isPending}>
              {isPending ? "Saving..." : editingSupplier ? "Save Changes" : "Create Supplier"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function SuppliersPageClient({
  orgId,
  initialSuppliers,
  initialItems,
}: SuppliersPageClientProps) {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const inventoryQueryKey = useMemo(() => [INVENTORY_QUERY_KEY_PREFIX, orgId] as const, [orgId]);
  const suppliersQueryKey = useMemo(() => [SUPPLIERS_QUERY_KEY_PREFIX, orgId] as const, [orgId]);

  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierOption | null>(null);
  const [assignSheetOpen, setAssignSheetOpen] = useState(false);
  const [assignSupplierId, setAssignSupplierId] = useState("");
  const [assignSearch, setAssignSearch] = useState("");
  const [assignSelectedItemIds, setAssignSelectedItemIds] = useState<string[]>([]);

  const suppliersQuery = useQuery({
    queryKey: suppliersQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("org_id", orgId)
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return ((data ?? []) as SupplierRow[]).map(normalizeSupplierRow);
    },
    initialData: initialSuppliers,
  });

  const inventoryQuery = useQuery({
    queryKey: inventoryQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("org_id", orgId)
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      return ((data ?? []) as InventoryRow[]).map(normalizeInventoryRow);
    },
    initialData: initialItems,
  });

  const suppliers = suppliersQuery.data ?? initialSuppliers;
  const items = inventoryQuery.data ?? initialItems;

  useEffect(() => {
    if (suppliersQuery.error) {
      toast.error("Could not load suppliers.");
    }
  }, [suppliersQuery.error]);

  useEffect(() => {
    if (inventoryQuery.error) {
      toast.error("Could not load inventory items.");
    }
  }, [inventoryQuery.error]);

  const suppliersById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier] as const)),
    [suppliers],
  );

  const itemsBySupplier = useMemo(() => {
    const map = new Map<string, InventoryItem[]>();

    for (const item of items) {
      if (!item.supplierId) {
        continue;
      }

      if (!map.has(item.supplierId)) {
        map.set(item.supplierId, []);
      }

      map.get(item.supplierId)?.push(item);
    }

    for (const linkedItems of map.values()) {
      linkedItems.sort((left, right) => left.name.localeCompare(right.name));
    }

    return map;
  }, [items]);

  const supplierRows = useMemo<SupplierTableRow[]>(
    () =>
      suppliers.map((supplier) => ({
        ...supplier,
        itemsCount: itemsBySupplier.get(supplier.id)?.length ?? 0,
      })),
    [suppliers, itemsBySupplier],
  );

  const createSupplierMutation = useMutation({
    mutationFn: async (values: SupplierFormValues) => {
      const payload = {
        org_id: orgId,
        name: values.name.trim(),
        category: values.category,
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        notes: values.notes?.trim() || null,
        active: values.active,
      };

      const { data, error } = await supabase
        .from("suppliers")
        .insert(payload)
        .select("*")
        .single();

      if (error || !data) {
        throw error ?? new Error("Unable to create supplier.");
      }

      return normalizeSupplierRow(data as SupplierRow);
    },
    onSuccess: (createdSupplier) => {
      const existingSuppliers = queryClient.getQueryData<SupplierOption[]>(suppliersQueryKey) ?? [];

      queryClient.setQueryData<SupplierOption[]>(
        suppliersQueryKey,
        [...existingSuppliers, createdSupplier].sort((left, right) => left.name.localeCompare(right.name)),
      );

      toast.success("Supplier created.");
    },
    onError: () => {
      toast.error("Could not create supplier.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKey });
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: SupplierFormValues }) => {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        phone: values.phone?.trim() || null,
        email: values.email?.trim() || null,
        notes: values.notes?.trim() || null,
        active: values.active,
      };

      const { data, error } = await supabase
        .from("suppliers")
        .update(payload)
        .eq("id", id)
        .eq("org_id", orgId)
        .select("*")
        .single();

      if (error || !data) {
        throw error ?? new Error("Unable to update supplier.");
      }

      return normalizeSupplierRow(data as SupplierRow);
    },
    onSuccess: (updatedSupplier) => {
      const existingSuppliers = queryClient.getQueryData<SupplierOption[]>(suppliersQueryKey) ?? [];

      queryClient.setQueryData<SupplierOption[]>(
        suppliersQueryKey,
        existingSuppliers
          .map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier))
          .sort((left, right) => left.name.localeCompare(right.name)),
      );

      toast.success("Supplier updated.");
    },
    onError: () => {
      toast.error("Could not update supplier.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKey });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const { count, error: countError } = await supabase
        .from("inventory_items")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId)
        .eq("supplier_id", supplierId);

      if (countError) {
        throw countError;
      }

      if ((count ?? 0) > 0) {
        throw new Error(`linked:${count}`);
      }

      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplierId)
        .eq("org_id", orgId);

      if (error) {
        throw error;
      }

      return supplierId;
    },
    onSuccess: (supplierId) => {
      const existingSuppliers = queryClient.getQueryData<SupplierOption[]>(suppliersQueryKey) ?? [];
      queryClient.setQueryData<SupplierOption[]>(
        suppliersQueryKey,
        existingSuppliers.filter((supplier) => supplier.id !== supplierId),
      );

      toast.success("Supplier deleted.");
    },
    onError: (error) => {
      if (error instanceof Error && error.message.startsWith("linked:")) {
        const count = Number(error.message.replace("linked:", ""));
        toast.warning(
          `Cannot delete supplier while ${count.toLocaleString()} inventory item${count === 1 ? "" : "s"} are linked.`,
        );
        return;
      }

      toast.error("Could not delete supplier.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suppliersQueryKey });
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
    },
  });

  const assignItemsMutation = useMutation({
    mutationFn: async ({ supplierId, itemIds }: { supplierId: string | null; itemIds: string[] }) => {
      const { error } = await supabase
        .from("inventory_items")
        .update({ supplier_id: supplierId })
        .eq("org_id", orgId)
        .in("id", itemIds);

      if (error) {
        throw error;
      }

      return { supplierId, itemIds };
    },
    onSuccess: ({ supplierId, itemIds }) => {
      const existingItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        existingItems.map((item) =>
          itemIds.includes(item.id)
            ? {
                ...item,
                supplierId,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(
        supplierId
          ? `Assigned ${itemIds.length.toLocaleString()} item${itemIds.length === 1 ? "" : "s"} to supplier.`
          : `Cleared supplier for ${itemIds.length.toLocaleString()} item${itemIds.length === 1 ? "" : "s"}.`,
      );
    },
    onError: () => {
      toast.error("Could not assign items to supplier.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKey });
      queryClient.invalidateQueries({ queryKey: suppliersQueryKey });
    },
  });

  const isMutating =
    createSupplierMutation.isPending ||
    updateSupplierMutation.isPending ||
    deleteSupplierMutation.isPending ||
    assignItemsMutation.isPending;

  const columns = useMemo<ColumnDef<SupplierTableRow>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => <SortHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{row.original.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">ID: {row.original.id}</p>
          </div>
        ),
        size: 320,
      },
      {
        id: "category",
        accessorKey: "category",
        header: ({ column }) => <SortHeader column={column} title="Category" />,
        cell: ({ row }) =>
          row.original.category ? (
            <Badge className={cn("border", supplierCategoryBadgeClassMap[row.original.category])}>
              {labelForSupplierCategory(row.original.category)}
            </Badge>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Unspecified</span>
          ),
        size: 170,
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: ({ column }) => <SortHeader column={column} title="Phone" />,
        cell: ({ row }) => <span>{row.original.phone ?? "-"}</span>,
        size: 150,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => <SortHeader column={column} title="Email" />,
        cell: ({ row }) => (
          <span className="truncate text-slate-700 dark:text-slate-300">{row.original.email ?? "-"}</span>
        ),
        size: 210,
      },
      {
        id: "itemsCount",
        accessorKey: "itemsCount",
        header: ({ column }) => <SortHeader column={column} title="Items Count" />,
        cell: ({ row }) => <span className="font-medium">{row.original.itemsCount.toLocaleString()}</span>,
        size: 120,
      },
      {
        id: "status",
        accessorKey: "active",
        header: ({ column }) => <SortHeader column={column} title="Status" />,
        cell: ({ row }) =>
          row.original.active ? (
            <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              Active
            </Badge>
          ) : (
            <Badge className="border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              Inactive
            </Badge>
          ),
        size: 100,
      },
      {
        id: "actions",
        header: () => <span className="text-xs font-semibold uppercase tracking-wide">Actions</span>,
        cell: ({ row }) => {
          const supplier = row.original;

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open supplier actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setSheetOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setAssignSupplierId(supplier.id);
                      setAssignSelectedItemIds([]);
                      setAssignSearch("");
                      setAssignSheetOpen(true);
                    }}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Assign Items
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      updateSupplierMutation.mutate({
                        id: supplier.id,
                        values: {
                          name: supplier.name,
                          category: supplier.category ?? "main_distributor",
                          phone: supplier.phone ?? "",
                          email: supplier.email ?? "",
                          notes: supplier.notes ?? "",
                          active: !supplier.active,
                        },
                      });
                    }}
                  >
                    <CircleDot className="mr-2 h-4 w-4" />
                    {supplier.active ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    onClick={() => {
                      if (supplier.itemsCount > 0) {
                        toast.warning(
                          `Cannot delete ${supplier.name} while ${supplier.itemsCount.toLocaleString()} linked item${supplier.itemsCount === 1 ? "" : "s"} remain.`,
                        );
                        return;
                      }

                      const confirmed = window.confirm(`Delete \"${supplier.name}\"? This cannot be undone.`);
                      if (confirmed) {
                        deleteSupplierMutation.mutate(supplier.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        size: 70,
      },
    ],
    [deleteSupplierMutation, updateSupplierMutation],
  );

  const table = useReactTable({
    data: supplierRows,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    enableExpanding: true,
    getRowCanExpand: () => true,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const pageRows = table.getRowModel().rows;
  const totalCount = supplierRows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startItem = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = totalCount === 0 ? 0 : pageIndex * pageSize + pageRows.length;

  const normalizedAssignSearch = assignSearch.trim().toLowerCase();

  const assignableItems = useMemo(
    () =>
      items.filter((item) => {
        if (!normalizedAssignSearch) {
          return true;
        }

        return (
          item.name.toLowerCase().includes(normalizedAssignSearch) ||
          labelForCategory(item.category).toLowerCase().includes(normalizedAssignSearch)
        );
      }),
    [items, normalizedAssignSearch],
  );

  const selectedAssignItemSet = useMemo(
    () => new Set(assignSelectedItemIds),
    [assignSelectedItemIds],
  );

  const allFilteredSelected =
    assignableItems.length > 0 &&
    assignableItems.every((item) => selectedAssignItemSet.has(item.id));

  async function handleSupplierSubmit(values: SupplierFormValues) {
    if (editingSupplier) {
      await updateSupplierMutation.mutateAsync({
        id: editingSupplier.id,
        values,
      });
    } else {
      await createSupplierMutation.mutateAsync(values);
    }

    setSheetOpen(false);
    setEditingSupplier(null);
  }

  function toggleAssignItem(itemId: string, checked: boolean) {
    setAssignSelectedItemIds((previous) => {
      if (checked) {
        return previous.includes(itemId) ? previous : [...previous, itemId];
      }

      return previous.filter((id) => id !== itemId);
    });
  }

  function setAllFilteredAssignItems(checked: boolean) {
    if (checked) {
      const next = new Set(assignSelectedItemIds);
      for (const item of assignableItems) {
        next.add(item.id);
      }
      setAssignSelectedItemIds(Array.from(next));
      return;
    }

    const filteredIds = new Set(assignableItems.map((item) => item.id));
    setAssignSelectedItemIds((previous) => previous.filter((id) => !filteredIds.has(id)));
  }

  async function handleAssignItems() {
    if (!assignSupplierId) {
      toast.error("Select a supplier first.");
      return;
    }

    if (assignSelectedItemIds.length === 0) {
      toast.error("Select at least one inventory item.");
      return;
    }

    await assignItemsMutation.mutateAsync({
      supplierId: assignSupplierId,
      itemIds: assignSelectedItemIds,
    });

    setAssignSheetOpen(false);
    setAssignSelectedItemIds([]);
    setAssignSearch("");
  }

  const showLoading = suppliersQuery.isLoading && suppliers.length === 0;

  return (
    <div className="space-y-6">
      <InventorySectionTabs />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Suppliers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage supplier contacts, category ownership, and linked inventory items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (suppliers.length === 0) {
                toast.warning("Add a supplier first before assigning items.");
                return;
              }

              setAssignSupplierId((current) => current || suppliers[0]?.id || "");
              setAssignSelectedItemIds([]);
              setAssignSearch("");
              setAssignSheetOpen(true);
            }}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Bulk Assign Items
          </Button>

          <Button
            className="bg-[#0f172a] hover:bg-slate-800"
            onClick={() => {
              setEditingSupplier(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </header>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>
            {totalCount.toLocaleString()} supplier{totalCount === 1 ? "" : "s"} in this organization.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {showLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : supplierRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <Building2 className="mx-auto mb-2 h-6 w-6 text-slate-500 dark:text-slate-400" />
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">No suppliers yet.</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your first supplier to start assigning inventory items.
              </p>
              <Button
                className="mt-4 bg-[#0f172a] hover:bg-slate-800"
                onClick={() => {
                  setEditingSupplier(null);
                  setSheetOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/70">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {pageRows.map((row) => {
                    const linkedItems = itemsBySupplier.get(row.original.id) ?? [];

                    return (
                      <Fragment key={row.id}>
                        <TableRow className="cursor-pointer" onClick={() => row.toggleExpanded()}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>

                        {row.getIsExpanded() ? (
                          <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/40">
                            <TableCell colSpan={row.getVisibleCells().length} className="py-4">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Linked Inventory Items ({linkedItems.length.toLocaleString()})
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Updated {formatDateTime(row.original.updatedAt)}
                                  </p>
                                </div>

                                {linkedItems.length === 0 ? (
                                  <div className="rounded-md border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                    No inventory items are currently linked to this supplier.
                                  </div>
                                ) : (
                                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                    {linkedItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span>{item.emoji}</span>
                                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {item.name}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                          {labelForCategory(item.category)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {supplierRows.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of {totalCount.toLocaleString()} suppliers
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <span className="min-w-[100px] text-center text-slate-500 dark:text-slate-400">
                  Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <SupplierSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setEditingSupplier(null);
          }
        }}
        editingSupplier={editingSupplier}
        onSubmit={handleSupplierSubmit}
        isPending={isMutating}
      />

      <Sheet
        open={assignSheetOpen}
        onOpenChange={(open) => {
          setAssignSheetOpen(open);
          if (!open) {
            setAssignSelectedItemIds([]);
            setAssignSearch("");
          }
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto border-slate-200 p-0 sm:max-w-2xl dark:border-slate-800">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bulk Assign Items</SheetTitle>
            <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
              Select inventory items and assign them to a supplier.
            </SheetDescription>
          </div>

          <div className="space-y-4 px-6 py-6">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={assignSupplierId || "none"} onValueChange={(value) => setAssignSupplierId(value === "none" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select supplier</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-search">Search inventory items</Label>
              <Input
                id="assign-search"
                value={assignSearch}
                onChange={(event) => setAssignSearch(event.target.value)}
                placeholder="Search by item name or category"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {assignSelectedItemIds.length.toLocaleString()} selected
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={(event) => setAllFilteredAssignItems(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]/40 dark:border-slate-600 dark:bg-slate-900"
                />
                Select all filtered
              </label>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-2 dark:border-slate-800">
              {assignableItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No inventory items match the current search.
                </div>
              ) : (
                assignableItems.map((item) => {
                  const checked = selectedAssignItemSet.has(item.id);
                  const currentSupplier = item.supplierId ? suppliersById.get(item.supplierId)?.name : null;

                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition-colors",
                        checked
                          ? "border-[#0d9488]/40 bg-[#0d9488]/10"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => toggleAssignItem(item.id, event.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]/40 dark:border-slate-600 dark:bg-slate-900"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.emoji} {item.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {labelForCategory(item.category)} • Current supplier: {currentSupplier ?? "Unassigned"}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setAssignSheetOpen(false)} disabled={isMutating}>
                Cancel
              </Button>
              <Button type="button" className="bg-[#0f172a] hover:bg-slate-800" onClick={handleAssignItems} disabled={isMutating}>
                {assignItemsMutation.isPending ? "Assigning..." : "Assign Selected Items"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
