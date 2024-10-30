"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Target,
  Users,
  BarChart,
  BrainCircuit,
  MessageSquare,
  Shield,
} from "lucide-react";

interface AssessmentInfo {
  Lvl: number;
  " Role Name": string;
  " Description": string;
  [key: string]: string | number;
}

const areaIcons = {
  " Building a Team": Users,
  " Developing Others": Lightbulb,
  " Leading a Team to Get Results": Target,
  " Managing Performance": BarChart,
  " Managing the Business": BrainCircuit,
  " Personal Development": BookOpen,
  " Communicating as a Leader": MessageSquare,
  " Creating the Environment": Shield,
};

interface KnowMoreAboutAssesmentProps {
  level: number;
}

export default function KnowMoreAboutAssesment({
  level,
}: KnowMoreAboutAssesmentProps) {
  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchAssessmentInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/assessment/about/${level}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assessment information");
        }
        const data = await response.json();
        setAssessmentInfo(data.filteredQuestions[0]);
      } catch (error) {
        console.error("Error fetching assessment information:", error);
        toast({
          title: "Error",
          description:
            "Failed to load assessment information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentInfo();
  }, [level]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="w-full h-12 mb-4" />
        <Skeleton className="w-full h-24 mb-4" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (!assessmentInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Assessment Information Not Found
        </h1>
        <p>
          We couldn't find the assessment information for the specified level.
          Please try again or contact support.
        </p>
      </div>
    );
  }

  const areaKeys = Object.keys(assessmentInfo).filter(
    (key) => key !== "Lvl" && key !== " Role Name" && key !== " Description"
  );

  const handleNext = () => {
    setCurrentAreaIndex((prev) => (prev + 1) % areaKeys.length);
  };

  const handlePrevious = () => {
    setCurrentAreaIndex(
      (prev) => (prev - 1 + areaKeys.length) % areaKeys.length
    );
  };

  const progress = ((currentAreaIndex + 1) / areaKeys.length) * 100;

  const areaKey = areaKeys[currentAreaIndex];
  const icon = areaIcons[areaKey as keyof typeof areaIcons] || BookOpen;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-blue-800">
            Level {assessmentInfo.Lvl} Assessment
          </CardTitle>
          <CardDescription className="text-2xl text-blue-600">
            {assessmentInfo[" Role Name"]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 leading-relaxed">
            {assessmentInfo[" Description"]}
          </p>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Progress value={progress} className="w-full h-2" />
        <p className="text-sm text-gray-600 mt-2">
          Progress: {Math.round(progress)}% ({currentAreaIndex + 1} of{" "}
          {areaKeys.length})
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentAreaIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="text-3xl font-semibold flex items-center">
                {React.createElement(icon, { className: "w-8 h-8 mr-3" })}
                {areaKeys[currentAreaIndex].trim()}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                {assessmentInfo[areaKeys[currentAreaIndex]]}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          variant="outline"
          className="flex items-center px-6 py-3 text-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-300"
        >
          <ChevronLeft className="w-6 h-6 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
        >
          Next
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
}
