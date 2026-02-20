"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronsLeftRight,
  CircleDot,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  Fragment,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSupabase } from "@/components/providers/supabase-provider";
import { InventorySectionTabs } from "@/components/dashboard/inventory/inventory-section-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  ITEM_CATEGORIES,
  SUPPLIER_CATEGORIES,
  labelForCategory,
  labelForSupplierCategory,
  normalizeInventoryRow,
  normalizeSupplierRow,
  toItemCategory,
  toSupplierCategory,
  type InventoryInsert,
  type InventoryItem,
  type InventoryRow,
  type InventoryUpdate,
  type ItemCategory,
  type SupplierCategory,
  type SupplierRow,
  type SupplierOption,
} from "./inventory-types";

const INVENTORY_QUERY_KEY_PREFIX = "inventory-items";
const SUPPLIERS_QUERY_KEY_PREFIX = "suppliers";

const categoryBadgeClassMap: Record<ItemCategory, string> = {
  fish: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300",
  protein:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300",
  produce:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-300",
  dry: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300",
  dairy_cold:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/40 dark:text-cyan-300",
  frozen:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300",
  sauces:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300",
  packaging:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  alcohol:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300",
};

const supplierCategoryBadgeClassMap: Record<SupplierCategory, string> = {
  fish_supplier:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300",
  main_distributor:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  asian_market:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300",
};

const inventoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  emoji: z.string().trim().max(16, "Keep emoji short").optional(),
  category: z.enum(ITEM_CATEGORIES),
  supplierCategory: z
    .enum(SUPPLIER_CATEGORIES)
    .optional()
    .or(z.literal("")),
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

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

type InventoryTableItem = InventoryItem & {
  supplierName: string | null;
};

type InventoryPageClientProps = {
  orgId: string;
  initialItems: InventoryItem[];
  initialSuppliers: SupplierOption[];
};

type ItemSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: InventoryItem | null;
  suppliers: SupplierOption[];
  onSubmit: (values: InventoryFormValues) => Promise<void>;
  isPending: boolean;
};

type BulkPatchInput = {
  ids: string[];
  values: InventoryUpdate;
  successMessage: string;
};

function escapeCsvCell(value: string | number | null | undefined) {
  if (value === null || typeof value === "undefined") {
    return "";
  }

  const raw = String(value);
  if (raw.includes(",") || raw.includes("\"") || raw.includes("\n")) {
    return `"${raw.replaceAll('"', '""')}"`;
  }

  return raw;
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

function defaultFormValues(item: InventoryItem | null): InventoryFormValues {
  if (!item) {
    return {
      name: "",
      emoji: "📦",
      category: "dry",
      supplierCategory: "",
      baseUnit: "",
      packUnit: "",
      packSize: "",
      supplierId: "",
      notes: "",
      active: true,
    };
  }

  return {
    name: item.name,
    emoji: item.emoji,
    category: item.category,
    supplierCategory: item.supplierCategory ?? "",
    baseUnit: item.baseUnit,
    packUnit: item.packUnit ?? "",
    packSize: item.packSize !== null ? String(item.packSize) : "",
    supplierId: item.supplierId ?? "",
    notes: item.notes ?? "",
    active: item.active,
  };
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}

function SortHeader({ column, title }: { column: Column<InventoryTableItem, unknown>; title: string }) {
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

function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
  onClick,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
}) {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      aria-label={ariaLabel}
      className="h-4 w-4 rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]/40 dark:border-slate-600 dark:bg-slate-900"
    />
  );
}

function InventoryItemSheet({
  open,
  onOpenChange,
  editingItem,
  suppliers,
  onSubmit,
  isPending,
}: ItemSheetProps) {
  const [supplierPopoverOpen, setSupplierPopoverOpen] = useState(false);

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: defaultFormValues(editingItem),
  });

  const selectedSupplierId = form.watch("supplierId");

  const selectedSupplierLabel = useMemo(() => {
    if (!selectedSupplierId) {
      return "Unassigned";
    }

    return suppliers.find((supplier) => supplier.id === selectedSupplierId)?.name ?? "Select supplier";
  }, [selectedSupplierId, suppliers]);

  useEffect(() => {
    form.reset(defaultFormValues(editingItem));
  }, [editingItem, form, open]);

  async function handleFormSubmit(values: InventoryFormValues) {
    await onSubmit(values);
    form.reset(defaultFormValues(null));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-slate-200 p-0 sm:max-w-xl dark:border-slate-800">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {editingItem ? "Edit item" : "Add item"}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
            {editingItem
              ? "Update inventory item details and supplier mapping."
              : "Create a new inventory item for this organization."}
          </SheetDescription>
        </div>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="space-y-2 sm:col-span-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Atlantic salmon fillet" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" placeholder="🐟" {...form.register("emoji")} />
              {form.formState.errors.emoji ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.emoji.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value as ItemCategory, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {labelForCategory(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.category.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Supplier Category</Label>
              <Select
                value={form.watch("supplierCategory") || "none"}
                onValueChange={(value) =>
                  form.setValue(
                    "supplierCategory",
                    (value === "none" ? "" : value) as InventoryFormValues["supplierCategory"],
                    { shouldDirty: true },
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SUPPLIER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {labelForSupplierCategory(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="baseUnit">Base Unit</Label>
              <Input id="baseUnit" placeholder="lb" {...form.register("baseUnit")} />
              {form.formState.errors.baseUnit ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.baseUnit.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packUnit">Pack Unit</Label>
              <Input id="packUnit" placeholder="case" {...form.register("packUnit")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packSize">Pack Size</Label>
              <Input id="packSize" type="number" min="0" step="0.01" placeholder="10" {...form.register("packSize")} />
              {form.formState.errors.packSize ? (
                <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.packSize.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supplier</Label>
            <Popover open={supplierPopoverOpen} onOpenChange={setSupplierPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">{selectedSupplierLabel}</span>
                  <ChevronsLeftRight className="h-4 w-4 text-slate-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[360px] p-0">
                <Command>
                  <CommandInput placeholder="Search suppliers..." />
                  <CommandList>
                    <CommandEmpty>No suppliers found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="unassigned"
                        onSelect={() => {
                          form.setValue("supplierId", "", { shouldDirty: true });
                          setSupplierPopoverOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", !selectedSupplierId ? "opacity-100" : "opacity-0")} />
                        Unassigned
                      </CommandItem>

                      {suppliers.map((supplier) => (
                        <CommandItem
                          key={supplier.id}
                          value={`${supplier.name} ${supplier.category ?? ""}`}
                          onSelect={() => {
                            form.setValue("supplierId", supplier.id, { shouldDirty: true });
                            setSupplierPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSupplierId === supplier.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="truncate">{supplier.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.supplierId ? (
              <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.supplierId.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={5} placeholder="Vendor SKU, handling notes, substitutions..." {...form.register("notes")} />
            {form.formState.errors.notes ? (
              <p className="text-xs text-red-600 dark:text-red-400">{form.formState.errors.notes.message}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Item status</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inactive items stay in history but are excluded from active workflows.</p>
            </div>
            <Switch
              checked={form.watch("active")}
              onCheckedChange={(checked) => form.setValue("active", checked, { shouldDirty: true })}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0f172a] hover:bg-slate-800" disabled={isPending}>
              {isPending ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function buildOptimisticItem(payload: InventoryInsert, tempId: string, orgId: string): InventoryItem {
  const name = payload.name?.trim() || "Untitled item";
  const emoji = payload.emoji?.trim() || "📦";
  const category = toItemCategory((payload.item_category as string | null | undefined) ?? payload.category);
  const supplierCategory = toSupplierCategory(payload.supplier_category as string | null | undefined);

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

export function InventoryPageClient({ orgId, initialItems, initialSuppliers }: InventoryPageClientProps) {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const inventoryQueryKey = useMemo(() => [INVENTORY_QUERY_KEY_PREFIX, orgId] as const, [orgId]);
  const suppliersQueryKey = useMemo(() => [SUPPLIERS_QUERY_KEY_PREFIX, orgId] as const, [orgId]);

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState<"all" | SupplierCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">("active");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 300);

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

  const items = inventoryQuery.data ?? initialItems;
  const suppliers = suppliersQuery.data ?? initialSuppliers;

  useEffect(() => {
    if (inventoryQuery.error) {
      toast.error("Could not load inventory items.");
    }
  }, [inventoryQuery.error]);

  useEffect(() => {
    if (suppliersQuery.error) {
      toast.error("Could not load suppliers.");
    }
  }, [suppliersQuery.error]);

  const suppliersById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier] as const)),
    [suppliers],
  );

  const tableItems = useMemo<InventoryTableItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        supplierName: item.supplierId ? suppliersById.get(item.supplierId)?.name ?? null : null,
      })),
    [items, suppliersById],
  );

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const filteredItems = useMemo(
    () =>
      tableItems.filter((item) => {
        const matchesSearch = normalizedSearch.length === 0 || item.name.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(item.category);

        const matchesSupplierCategory =
          supplierCategoryFilter === "all" || item.supplierCategory === supplierCategoryFilter;

        const matchesStatus = statusFilter === "active" ? item.active : !item.active;

        return matchesSearch && matchesCategory && matchesSupplierCategory && matchesStatus;
      }),
    [normalizedSearch, selectedCategories, statusFilter, supplierCategoryFilter, tableItems],
  );

  const createMutation = useMutation({
    mutationFn: async ({ payload }: { payload: InventoryInsert; tempId: string }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .insert(payload)
        .select("*")
        .single();

      if (error || !data) {
        throw error ?? new Error("Unable to create item.");
      }

      return normalizeInventoryRow(data as InventoryRow);
    },
    onMutate: async ({ payload, tempId }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });

      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];
      const optimisticItem = buildOptimisticItem(payload, tempId, orgId);

      queryClient.setQueryData<InventoryItem[]>(inventoryQueryKey, [optimisticItem, ...previousItems]);

      return { previousItems, tempId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryQueryKey, context.previousItems);
      }

      toast.error("Could not create inventory item.");
    },
    onSuccess: (createdItem, _variables, context) => {
      if (!context?.tempId) {
        return;
      }

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

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: InventoryUpdate }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .update(values)
        .eq("id", id)
        .eq("org_id", orgId)
        .select("*")
        .single();

      if (error || !data) {
        throw error ?? new Error("Unable to update item.");
      }

      return normalizeInventoryRow(data as InventoryRow);
    },
    onMutate: async ({ id, values }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });

      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        previousItems.map((item) => {
          if (item.id !== id) {
            return item;
          }

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id)
        .eq("org_id", orgId);

      if (error) {
        throw error;
      }

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

  const bulkPatchMutation = useMutation({
    mutationFn: async ({ ids, values }: BulkPatchInput) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .update(values)
        .eq("org_id", orgId)
        .in("id", ids)
        .select("*");

      if (error) {
        throw error;
      }

      return ((data ?? []) as InventoryRow[]).map(normalizeInventoryRow);
    },
    onMutate: async ({ ids, values }) => {
      await queryClient.cancelQueries({ queryKey: inventoryQueryKey });
      const previousItems = queryClient.getQueryData<InventoryItem[]>(inventoryQueryKey) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        inventoryQueryKey,
        previousItems.map((item) => {
          if (!ids.includes(item.id)) {
            return item;
          }

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

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    bulkPatchMutation.isPending;

  const columns = useMemo<ColumnDef<InventoryTableItem>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
            <IndeterminateCheckbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              ariaLabel="Select all rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              ariaLabel={`Select ${row.original.name}`}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        ),
        enableSorting: false,
        size: 44,
      },
      {
        id: "emoji",
        accessorKey: "emoji",
        header: () => <span className="text-xs font-semibold uppercase tracking-wide">Emoji</span>,
        cell: ({ row }) => <div className="text-center text-lg leading-none">{row.original.emoji}</div>,
        enableSorting: false,
        size: 70,
      },
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
        size: 300,
      },
      {
        id: "category",
        accessorKey: "category",
        header: ({ column }) => <SortHeader column={column} title="Category" />,
        cell: ({ row }) => (
          <Badge className={cn("border font-medium", categoryBadgeClassMap[row.original.category])}>
            {labelForCategory(row.original.category)}
          </Badge>
        ),
        size: 150,
      },
      {
        id: "supplierCategory",
        accessorKey: "supplierCategory",
        header: ({ column }) => <SortHeader column={column} title="Supplier Category" />,
        cell: ({ row }) =>
          row.original.supplierCategory ? (
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                supplierCategoryBadgeClassMap[row.original.supplierCategory],
              )}
            >
              {labelForSupplierCategory(row.original.supplierCategory)}
            </Badge>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">Unspecified</span>
          ),
        size: 170,
      },
      {
        id: "baseUnit",
        accessorKey: "baseUnit",
        header: ({ column }) => <SortHeader column={column} title="Base Unit" />,
        cell: ({ row }) => <span>{row.original.baseUnit}</span>,
        size: 110,
      },
      {
        id: "packUnit",
        accessorKey: "packUnit",
        header: ({ column }) => <SortHeader column={column} title="Pack Unit" />,
        cell: ({ row }) => (
          <span className="text-slate-700 dark:text-slate-300">{row.original.packUnit ?? "-"}</span>
        ),
        size: 100,
      },
      {
        id: "packSize",
        accessorKey: "packSize",
        header: ({ column }) => <SortHeader column={column} title="Pack Size" />,
        cell: ({ row }) => <span>{row.original.packSize ?? "-"}</span>,
        size: 100,
      },
      {
        id: "supplier",
        accessorKey: "supplierName",
        header: ({ column }) => <SortHeader column={column} title="Supplier" />,
        cell: ({ row }) =>
          row.original.supplierName ? (
            <span className="truncate">{row.original.supplierName}</span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">Unassigned</span>
          ),
        size: 170,
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
        size: 95,
      },
      {
        id: "actions",
        header: () => <span className="text-xs font-semibold uppercase tracking-wide">Actions</span>,
        cell: ({ row }) => {
          const currentItem = row.original;

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingItem(currentItem);
                      setSheetOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      const payload: InventoryInsert = {
                        org_id: orgId,
                        name: `${currentItem.name} (Copy)`,
                        emoji: currentItem.emoji,
                        category: currentItem.category,
                        item_category: currentItem.category,
                        supplier_category: currentItem.supplierCategory,
                        base_unit: currentItem.baseUnit,
                        pack_unit: currentItem.packUnit,
                        pack_size: currentItem.packSize,
                        supplier_id: currentItem.supplierId,
                        notes: currentItem.notes,
                        active: currentItem.active,
                      };

                      createMutation.mutate({
                        payload,
                        tempId: `temp-copy-${Date.now()}`,
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      bulkPatchMutation.mutate({
                        ids: [currentItem.id],
                        values: { active: !currentItem.active },
                        successMessage: currentItem.active ? "Item deactivated." : "Item activated.",
                      });
                    }}
                  >
                    <CircleDot className="mr-2 h-4 w-4" />
                    {currentItem.active ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    onClick={() => {
                      const confirmed = window.confirm(`Delete \"${currentItem.name}\"? This cannot be undone.`);

                      if (confirmed) {
                        deleteMutation.mutate(currentItem.id);
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
    [bulkPatchMutation, createMutation, deleteMutation, orgId],
  );

  const table = useReactTable({
    data: filteredItems,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    enableRowSelection: true,
    enableExpanding: true,
    getRowCanExpand: () => true,
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [debouncedSearch, selectedCategories, supplierCategoryFilter, statusFilter, table]);

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  const totalFilteredCount = filteredItems.length;
  const currentPageRows = table.getRowModel().rows;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const startItem = totalFilteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = totalFilteredCount === 0 ? 0 : pageIndex * pageSize + currentPageRows.length;

  const handleCategoryToggle = useCallback((category: ItemCategory, checked: boolean) => {
    setSelectedCategories((previous) => {
      if (checked) {
        return previous.includes(category) ? previous : [...previous, category];
      }

      return previous.filter((value) => value !== category);
    });
  }, []);

  const handleCsvExport = useCallback(() => {
    const exportRows = table.getPrePaginationRowModel().rows.map((row) => row.original);

    if (exportRows.length === 0) {
      toast.info("No rows available to export.");
      return;
    }

    const header = [
      "emoji",
      "name",
      "category",
      "supplier_category",
      "base_unit",
      "pack_unit",
      "pack_size",
      "supplier",
      "status",
      "notes",
    ];

    const csvLines = [
      header.join(","),
      ...exportRows.map((item) =>
        [
          item.emoji,
          item.name,
          labelForCategory(item.category),
          item.supplierCategory ? labelForSupplierCategory(item.supplierCategory) : "",
          item.baseUnit,
          item.packUnit,
          item.packSize,
          item.supplierName,
          item.active ? "Active" : "Inactive",
          item.notes,
        ]
          .map((value) => escapeCsvCell(value))
          .join(","),
      ),
    ];

    const csvBlob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    toast.success("Inventory exported to CSV.");
  }, [table]);

  async function handleSheetSubmit(values: InventoryFormValues) {
    const packSizeValue =
      values.packSize && values.packSize.trim().length > 0
        ? Number(values.packSize)
        : null;

    const normalizedPayload = {
      name: values.name.trim(),
      emoji: values.emoji?.trim() || null,
      category: values.category,
      item_category: values.category,
      supplier_category: values.supplierCategory || null,
      base_unit: values.baseUnit.trim(),
      pack_unit: values.packUnit?.trim() || null,
      pack_size: Number.isFinite(packSizeValue) ? packSizeValue : null,
      supplier_id: values.supplierId?.trim() || null,
      notes: values.notes?.trim() || null,
      active: values.active,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        values: normalizedPayload,
      });

      toast.success("Inventory item updated.");
    } else {
      await createMutation.mutateAsync({
        tempId: `temp-${Date.now()}`,
        payload: {
          org_id: orgId,
          ...normalizedPayload,
        },
      });

      toast.success("Inventory item created.");
    }

    setSheetOpen(false);
    setEditingItem(null);
  }

  async function handleBulkAssignSupplier(supplierId: string | null) {
    if (selectedIds.length === 0) {
      return;
    }

    await bulkPatchMutation.mutateAsync({
      ids: selectedIds,
      values: {
        supplier_id: supplierId,
      },
      successMessage:
        supplierId === null ? "Supplier cleared for selected items." : "Supplier assigned to selected items.",
    });

    setRowSelection({});
  }

  async function handleBulkChangeCategory(category: ItemCategory) {
    if (selectedIds.length === 0) {
      return;
    }

    await bulkPatchMutation.mutateAsync({
      ids: selectedIds,
      values: {
        category,
        item_category: category,
      },
      successMessage: `Category changed to ${labelForCategory(category)}.`,
    });

    setRowSelection({});
  }

  async function handleBulkDeactivate() {
    if (selectedIds.length === 0) {
      return;
    }

    await bulkPatchMutation.mutateAsync({
      ids: selectedIds,
      values: {
        active: false,
      },
      successMessage: "Selected items deactivated.",
    });

    setRowSelection({});
  }

  const showInitialLoading = inventoryQuery.isLoading && items.length === 0;

  return (
    <div className="space-y-6">
      <InventorySectionTabs />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your ingredient catalog</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            onClick={handleCsvExport}
          >
            Export CSV
          </Button>

          <Button
            className="bg-[#0f172a] hover:bg-slate-800"
            onClick={() => {
              setEditingItem(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </header>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(320px,1fr)_220px_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search inventory by name"
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {selectedCategories.length === 0
                      ? "All categories"
                      : `${selectedCategories.length} categor${selectedCategories.length === 1 ? "y" : "ies"}`}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Item categories</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {ITEM_CATEGORIES.map((category) => {
                  const isChecked = selectedCategories.includes(category);

                  return (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={isChecked}
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={(checked) => handleCategoryToggle(category, checked === true)}
                    >
                      {labelForCategory(category)}
                    </DropdownMenuCheckboxItem>
                  );
                })}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedCategories([])}>Clear category filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select
              value={supplierCategoryFilter}
              onValueChange={(value) => setSupplierCategoryFilter(value as "all" | SupplierCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Supplier category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All supplier categories</SelectItem>
                {SUPPLIER_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {labelForSupplierCategory(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="inline-flex h-10 rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={cn(
                  "rounded px-3 text-sm font-medium transition-colors",
                  statusFilter === "active"
                    ? "bg-[#0d9488]/15 text-[#0d9488]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={cn(
                  "rounded px-3 text-sm font-medium transition-colors",
                  statusFilter === "inactive"
                    ? "bg-[#0d9488]/15 text-[#0d9488]"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                Inactive
              </button>
            </div>
          </div>

          <CardDescription>
            {totalFilteredCount.toLocaleString()} item{totalFilteredCount === 1 ? "" : "s"} match current filters.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedIds.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#0d9488]/30 bg-[#0d9488]/10 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-medium">{selectedIds.length} items selected</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="border-current/30 bg-white/70 dark:bg-slate-900">
                    Assign Supplier
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="start">
                  <DropdownMenuLabel>Select supplier</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAssignSupplier(null)}>Unassigned</DropdownMenuItem>
                  {suppliers.map((supplier) => (
                    <DropdownMenuItem key={supplier.id} onClick={() => handleBulkAssignSupplier(supplier.id)}>
                      {supplier.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="border-current/30 bg-white/70 dark:bg-slate-900">
                    Change Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Select category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {ITEM_CATEGORIES.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => handleBulkChangeCategory(category)}>
                      {labelForCategory(category)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="outline" className="border-current/30 bg-white/70 dark:bg-slate-900" onClick={handleBulkDeactivate}>
                Deactivate
              </Button>

              <Button size="sm" variant="ghost" onClick={() => setRowSelection({})}>
                Clear
              </Button>
            </div>
          ) : null}

          {showInitialLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredItems.length === 0 ? (
            items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">No inventory items yet.</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add your first item to get started.
                </p>
                <Button
                  className="mt-4 bg-[#0f172a] hover:bg-slate-800"
                  onClick={() => {
                    setEditingItem(null);
                    setSheetOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">No items match your filters.</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting search text, categories, or status.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchInput("");
                    setSelectedCategories([]);
                    setSupplierCategoryFilter("all");
                    setStatusFilter("active");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )
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
                  {table.getRowModel().rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        className="cursor-pointer"
                        data-state={row.getIsSelected() ? "selected" : undefined}
                        onClick={() => row.toggleExpanded()}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>

                      {row.getIsExpanded() ? (
                        <TableRow key={`${row.id}-expanded`} className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/40">
                          <TableCell colSpan={row.getVisibleCells().length} className="py-4">
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  Pack Configuration
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {row.original.packSize ?? "-"} {row.original.packUnit ?? ""}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  Supplier Category
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {row.original.supplierCategory
                                    ? labelForSupplierCategory(row.original.supplierCategory)
                                    : "Unspecified"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  Created
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {formatDateTime(row.original.createdAt)}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                  Updated
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {formatDateTime(row.original.updatedAt)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                              {row.original.notes || "No notes added for this item yet."}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredItems.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of {totalFilteredCount.toLocaleString()} items
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

      <InventoryItemSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        editingItem={editingItem}
        suppliers={suppliers}
        onSubmit={handleSheetSubmit}
        isPending={isMutating}
      />
    </div>
  );
}
