"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";

interface DevelopmentPlan {
  id: string;
  plan: {
    development_plan: {
      metadata: {
        participant_id: string;
        generated_date: string;
      };
      sections: {
        executive_summary: {
          overall_assessment: string;
          key_strengths: Array<{ strength: string; score: number }>;
          development_areas: Array<{ area: string; score: number }>;
          high_level_development_focus: string;
        };
        assessment_overview: {
          capability_scores: {
            [key: string]: number;
          };
        };
      };
    };
  };
}

export default function DevelopmentPlansPage() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/users/assessments");
        const data = await response.json();
        setPlans(data.developmentPlans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Failed to load development plans");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPlans();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Development Plan</h1>
      {plans.map((plan) => (
        <div key={plan.id} className="space-y-6">
          {/* Overview Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-700 mb-4">
              {
                plan.plan.development_plan.sections.executive_summary
                  .overall_assessment
              }
            </p>
            <p className="text-indigo-600 font-medium">
              Focus Area:{" "}
              {
                plan.plan.development_plan.sections.executive_summary
                  .high_level_development_focus
              }
            </p>
          </Card>

          {/* Strengths and Development Areas */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold">Key Strengths</h2>
              </div>
              <div className="space-y-4">
                {plan.plan.development_plan.sections.executive_summary.key_strengths.map(
                  (strength, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{strength.strength}</span>
                        <span className="text-green-600">
                          {strength.score}/5
                        </span>
                      </div>
                      <Progress
                        value={(strength.score / 5) * 100}
                        className="h-2 bg-gray-100"
                      />
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Development Areas */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold">Development Areas</h2>
              </div>
              <div className="space-y-4">
                {plan.plan.development_plan.sections.executive_summary.development_areas.map(
                  (area, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{area.area}</span>
                        <span className="text-orange-600">{area.score}/5</span>
                      </div>
                      <Progress
                        value={(area.score / 5) * 100}
                        className="h-2 bg-gray-100"
                      />
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>

          {/* Capability Scores */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Capability Scores</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(
                plan.plan.development_plan.sections.assessment_overview
                  .capability_scores
              ).map(([capability, score], index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{capability}</span>
                    <span className="text-indigo-600">{score}/5</span>
                  </div>
                  <Progress
                    value={(score / 5) * 100}
                    className="h-2 bg-gray-200"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-4 bg-gray-50">
            <div className="text-sm text-gray-500">
              <span className="mr-4">
                Participant:{" "}
                {plan.plan.development_plan.metadata.participant_id}
              </span>
              <span>
                Generated:{" "}
                {new Date(
                  plan.plan.development_plan.metadata.generated_date
                ).toLocaleDateString()}
              </span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
