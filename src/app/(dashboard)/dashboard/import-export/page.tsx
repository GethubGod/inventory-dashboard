import { DashboardPagePlaceholder } from "@/components/layout/dashboard-page-placeholder";

export default function ImportExportPage() {
  return (
    <DashboardPagePlaceholder
      title="Import / Export"
      description="Import and export inventory data between Supabase and external sources."
      comingSoonItems={[
        "Import inventory from Google Sheets or CSV files",
        "Export current Supabase inventory to CSV",
        "Preview conflicts before importing",
        "Map imported columns to database fields",
        "Batch update existing items from import data",
      ]}
    />
  );
}
