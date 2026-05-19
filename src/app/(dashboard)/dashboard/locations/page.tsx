import { DashboardPagePlaceholder } from "@/components/layout/dashboard-page-placeholder";

export default function LocationsPage() {
  return (
    <DashboardPagePlaceholder
      title="Locations"
      description="Manage your restaurant and warehouse locations."
      comingSoonItems={[
        "Add and edit location details (name, address, phone)",
        "Assign inventory items to specific locations",
        "View location-specific stock levels",
        "Set location operating hours and delivery windows",
      ]}
    />
  );
}
