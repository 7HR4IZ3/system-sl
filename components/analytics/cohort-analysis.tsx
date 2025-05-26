"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CohortAnalysis() {
  const [metric, setMetric] = useState("retention");

  // Sample data - in a real app, this would come from the database
  const cohortData = {
    retention: [
      {
        cohort: "Jan 2023",
        month1: "100%",
        month2: "65%",
        month3: "48%",
        month4: "42%",
        month5: "38%",
        month6: "35%",
      },
      {
        cohort: "Feb 2023",
        month1: "100%",
        month2: "68%",
        month3: "52%",
        month4: "45%",
        month5: "40%",
        month6: "-",
      },
      {
        cohort: "Mar 2023",
        month1: "100%",
        month2: "70%",
        month3: "55%",
        month4: "48%",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Apr 2023",
        month1: "100%",
        month2: "72%",
        month3: "58%",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "May 2023",
        month1: "100%",
        month2: "75%",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Jun 2023",
        month1: "100%",
        month2: "-",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
    ],
    engagement: [
      {
        cohort: "Jan 2023",
        month1: "8.2",
        month2: "6.5",
        month3: "5.8",
        month4: "5.2",
        month5: "4.8",
        month6: "4.5",
      },
      {
        cohort: "Feb 2023",
        month1: "8.5",
        month2: "6.8",
        month3: "6.0",
        month4: "5.5",
        month5: "5.0",
        month6: "-",
      },
      {
        cohort: "Mar 2023",
        month1: "8.8",
        month2: "7.0",
        month3: "6.2",
        month4: "5.8",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Apr 2023",
        month1: "9.0",
        month2: "7.2",
        month3: "6.5",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "May 2023",
        month1: "9.2",
        month2: "7.5",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Jun 2023",
        month1: "9.5",
        month2: "-",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
    ],
    conversion: [
      {
        cohort: "Jan 2023",
        month1: "5%",
        month2: "8%",
        month3: "10%",
        month4: "12%",
        month5: "13%",
        month6: "14%",
      },
      {
        cohort: "Feb 2023",
        month1: "5.5%",
        month2: "8.5%",
        month3: "11%",
        month4: "13%",
        month5: "14%",
        month6: "-",
      },
      {
        cohort: "Mar 2023",
        month1: "6%",
        month2: "9%",
        month3: "12%",
        month4: "14%",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Apr 2023",
        month1: "6.5%",
        month2: "10%",
        month3: "13%",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "May 2023",
        month1: "7%",
        month2: "11%",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
      {
        cohort: "Jun 2023",
        month1: "7.5%",
        month2: "-",
        month3: "-",
        month4: "-",
        month5: "-",
        month6: "-",
      },
    ],
  };

  const metricLabels = {
    retention: "User Retention",
    engagement: "Sessions per Week",
    conversion: "Premium Conversion",
  };

  const getColorClass = (value: string, metricType: string) => {
    if (value === "-") return "";

    if (metricType === "retention") {
      const numValue = Number.parseFloat(value.replace("%", ""));
      if (numValue >= 70) return "bg-green-100 dark:bg-green-900/20";
      if (numValue >= 50) return "bg-yellow-100 dark:bg-yellow-900/20";
      if (numValue >= 30) return "bg-orange-100 dark:bg-orange-900/20";
      return "bg-red-100 dark:bg-red-900/20";
    }

    if (metricType === "engagement") {
      const numValue = Number.parseFloat(value);
      if (numValue >= 7) return "bg-green-100 dark:bg-green-900/20";
      if (numValue >= 5) return "bg-yellow-100 dark:bg-yellow-900/20";
      if (numValue >= 3) return "bg-orange-100 dark:bg-orange-900/20";
      return "bg-red-100 dark:bg-red-900/20";
    }

    if (metricType === "conversion") {
      const numValue = Number.parseFloat(value.replace("%", ""));
      if (numValue >= 12) return "bg-green-100 dark:bg-green-900/20";
      if (numValue >= 8) return "bg-yellow-100 dark:bg-yellow-900/20";
      if (numValue >= 5) return "bg-orange-100 dark:bg-orange-900/20";
      return "bg-red-100 dark:bg-red-900/20";
    }

    return "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Cohort Analysis</CardTitle>
            <CardDescription>
              Track user behavior over time by signup cohort
            </CardDescription>
          </div>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retention">User Retention</SelectItem>
              <SelectItem value="engagement">User Engagement</SelectItem>
              <SelectItem value="conversion">Premium Conversion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Cohort</TableHead>
                <TableHead className="text-center">Month 1</TableHead>
                <TableHead className="text-center">Month 2</TableHead>
                <TableHead className="text-center">Month 3</TableHead>
                <TableHead className="text-center">Month 4</TableHead>
                <TableHead className="text-center">Month 5</TableHead>
                <TableHead className="text-center">Month 6</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohortData[metric as keyof typeof cohortData].map(
                (row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.cohort}</TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month1, metric)}`}
                    >
                      {row.month1}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month2, metric)}`}
                    >
                      {row.month2}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month3, metric)}`}
                    >
                      {row.month3}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month4, metric)}`}
                    >
                      {row.month4}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month5, metric)}`}
                    >
                      {row.month5}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getColorClass(row.month6, metric)}`}
                    >
                      {row.month6}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            {metric === "retention" &&
              "Shows the percentage of users still active after each month."}
            {metric === "engagement" &&
              "Shows the average number of sessions per week for each cohort."}
            {metric === "conversion" &&
              "Shows the percentage of users who converted to premium."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
