"use client";

import { useState } from "react";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const { nextStep, skipOnboarding } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      title: "Welcome to LevelUp",
      description:
        "Your journey to better productivity starts here. Turn your daily tasks into a fun, rewarding experience.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Track Your Progress",
      description:
        "Set goals, complete tasks, and build habits. Watch your progress grow over time.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Earn Rewards",
      description:
        "Gain experience points, level up, and unlock achievements as you accomplish your goals.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Join Challenges",
      description:
        "Compete with friends or join community challenges to stay motivated and accountable.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide === slides.length - 1) {
      nextStep();
    } else {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[500px]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={skipOnboarding}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Skip</span>
            </Button>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="mb-6">
                  <img
                    src={slides[currentSlide].image || "/placeholder.svg"}
                    alt={slides[currentSlide].title}
                    className="h-40 w-40 object-contain mx-auto"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-4">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentSlide
                        ? "bg-primary"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <Button variant="ghost" size="icon" onClick={handleNextSlide}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>

          <div className="p-6 border-t">
            <Button className="w-full" onClick={handleNextSlide}>
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
