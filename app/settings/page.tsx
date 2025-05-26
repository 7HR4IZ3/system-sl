import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsHeader from "@/components/settings/settings-header";
import ProfileSettings from "@/components/settings/profile-settings";
import AppearanceSettings from "@/components/settings/appearance-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import AccountSettings from "@/components/settings/account-settings";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background pb-8">
      <SettingsHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Profile</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <ProfileSettings />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Appearance</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
              >
                <AppearanceSettings />
              </Suspense>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <NotificationSettings />
              </Suspense>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Account</h2>
              </div>
              <Suspense
                fallback={<Skeleton className="h-64 w-full rounded-lg" />}
              >
                <AccountSettings />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
