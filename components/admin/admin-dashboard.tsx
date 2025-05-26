"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAchievements from "@/components/admin/admin-achievements";
import AdminChallenges from "@/components/admin/admin-challenges";
import AdminUsers from "@/components/admin/admin-users";
import AdminStats from "@/components/admin/admin-stats";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>
        <TabsContent value="achievements">
          <AdminAchievements />
        </TabsContent>
        <TabsContent value="challenges">
          <AdminChallenges />
        </TabsContent>
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
