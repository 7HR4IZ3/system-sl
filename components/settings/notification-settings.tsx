"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      taskReminders: true,
      goalUpdates: true,
      achievementUnlocks: true,
      friendActivity: false,
      weeklyReport: true,
    },
    push: {
      taskReminders: true,
      goalUpdates: true,
      achievementUnlocks: true,
      friendActivity: true,
      weeklyReport: false,
    },
  });

  const handleToggle = (type, setting) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting],
      },
    }));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-base font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-task-reminders" className="flex-1">
                Task Reminders
              </Label>
              <Switch
                id="email-task-reminders"
                checked={notifications.email.taskReminders}
                onCheckedChange={() => handleToggle("email", "taskReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-goal-updates" className="flex-1">
                Goal Updates
              </Label>
              <Switch
                id="email-goal-updates"
                checked={notifications.email.goalUpdates}
                onCheckedChange={() => handleToggle("email", "goalUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-achievement-unlocks" className="flex-1">
                Achievement Unlocks
              </Label>
              <Switch
                id="email-achievement-unlocks"
                checked={notifications.email.achievementUnlocks}
                onCheckedChange={() =>
                  handleToggle("email", "achievementUnlocks")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-friend-activity" className="flex-1">
                Friend Activity
              </Label>
              <Switch
                id="email-friend-activity"
                checked={notifications.email.friendActivity}
                onCheckedChange={() => handleToggle("email", "friendActivity")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email-weekly-report" className="flex-1">
                Weekly Report
              </Label>
              <Switch
                id="email-weekly-report"
                checked={notifications.email.weeklyReport}
                onCheckedChange={() => handleToggle("email", "weeklyReport")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-task-reminders" className="flex-1">
                Task Reminders
              </Label>
              <Switch
                id="push-task-reminders"
                checked={notifications.push.taskReminders}
                onCheckedChange={() => handleToggle("push", "taskReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-goal-updates" className="flex-1">
                Goal Updates
              </Label>
              <Switch
                id="push-goal-updates"
                checked={notifications.push.goalUpdates}
                onCheckedChange={() => handleToggle("push", "goalUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-achievement-unlocks" className="flex-1">
                Achievement Unlocks
              </Label>
              <Switch
                id="push-achievement-unlocks"
                checked={notifications.push.achievementUnlocks}
                onCheckedChange={() =>
                  handleToggle("push", "achievementUnlocks")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-friend-activity" className="flex-1">
                Friend Activity
              </Label>
              <Switch
                id="push-friend-activity"
                checked={notifications.push.friendActivity}
                onCheckedChange={() => handleToggle("push", "friendActivity")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-weekly-report" className="flex-1">
                Weekly Report
              </Label>
              <Switch
                id="push-weekly-report"
                checked={notifications.push.weeklyReport}
                onCheckedChange={() => handleToggle("push", "weeklyReport")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
