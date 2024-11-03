import dynamic from "next/dynamic";

// Create a dynamic component with ssr disabled
const AdminDashboardContent = dynamic(
  () => import("@/components/AdminDashboardContent"),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminDashboardContent />;
}
