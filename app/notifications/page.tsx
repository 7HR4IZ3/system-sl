import type { Metadata } from "next";
import NotificationsList from "@/components/notifications/notifications-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Notifications | Productivity App",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsList />
        </CardContent>
      </Card>
    </div>
  );
}
