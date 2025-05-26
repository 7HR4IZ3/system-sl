"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, BarChart } from "lucide-react";
import { useState } from "react";

export default function AnalyticsHeader() {
  const [timeRange, setTimeRange] = useState("30days");

  return (
    <div className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Analytics</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" /> Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
