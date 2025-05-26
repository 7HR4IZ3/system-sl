"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { CheckCircle, ChevronRight } from "lucide-react";
import Confetti from "@/components/ui/confetti";

export default function CompletePage() {
  const [confetti, setConfetti] = useState<Boolean>(false);
  const { completeOnboarding } = useOnboarding();

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Confetti className={confetti ? "active" : ""} />

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">
            You're All Set!
          </CardTitle>
          <CardDescription className="text-center">
            Congratulations on completing the onboarding process. You're ready
            to start your productivity journey!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What you've accomplished:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Created your profile</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Set your first goal</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Created a habit</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Earned 100 XP</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => completeOnboarding()} className="w-full">
            Go to Dashboard
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
