"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <WifiOff className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">You're Offline</CardTitle>
          <CardDescription className="text-center">
            It looks like you've lost your internet connection. Some features
            may be limited until you're back online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">What you can still do:</h3>
            <ul className="space-y-2 pl-5 list-disc">
              <li>View your goals and tasks</li>
              <li>Mark tasks as complete (will sync later)</li>
              <li>Track your habits (will sync later)</li>
              <li>View your achievements</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
