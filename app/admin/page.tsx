import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Dashboard | Productivity App",
  description: "Manage your productivity app",
};

export default function AdminPage() {
  return (
    <div className="container max-w-7xl py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
