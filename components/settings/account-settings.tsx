"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Download, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountSettings() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-base font-medium">Password</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            <Button size="sm">Update Password</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">Data & Privacy</h3>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export Your Data
            </Button>

            <Alert variant="destructive" className="bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Deleting your account is permanent and cannot be undone.
              </AlertDescription>
            </Alert>

            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
