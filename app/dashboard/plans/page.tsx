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
        version: string;
        participant_id: string;
        generated_date: string;
      };
      sections: {
        conclusion: {
          next_steps_outline: string;
          support_contact_information: string;
          motivational_closing_message: string;
          progress_tracking_suggestions: string;
        };
        cover_page: {
          title: string;
          assessment_date: string;
          participant_name: string;
        };
        personal_profile: {
          context_within_career_stage: string;
          assigned_responsibility_level: string;
          demographic_information_analysis: {
            industry: string;
            "role/title": string;
            company_size: string;
            years_of_experience: number;
          };
        };
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
          overall_performance_patterns: string;
          skills_vs_confidence_analysis: string;
          interpretation_of_results_relative_to_role: string;
        };
        detailed_capability_analysis: {
          [key: string]: DetailedCapability;
        };
        personal_development_planning: {
          success_metrics: string[];
          goal_setting_framework: {
            examples: string[];
          };
          progress_tracking_tools: string;
          action_planning_guidance: {
            long_term_actions: string[];
            short_term_actions: string[];
          };
        };
        additional_support: {
          tips_for_development_success: string;
          additional_learning_resources: string[];
          common_challenges_and_solutions: string;
          support_networks_and_communities: string;
        };
      };
    };
  };
}

interface DetailedCapability {
  resources: string;
  strengths: string;
  importance: string;
  recommendations: string[];
  confidence_level: number;
  development_areas: string;
  focus_areas_analysis: {
    subcategories: string[];
    role_specific_importance: string;
    self_assessment_interpretation: string;
  };
  current_proficiency_level: number;
}

export default function DevelopmentPlansPage() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

  if (!plans.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>No development plans found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Development Plans</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {plan.title || "Development Plan"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      plan.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {plan.status || "in_progress"}
                  </span>
                  <Progress value={plan.progress || 0} className="w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const plan = selectedPlan.plan?.development_plan;
  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedPlan(null)}
          className="mb-4 text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Plans
        </button>
        <Alert variant="destructive">
          <AlertDescription>Invalid plan data structure</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderCapabilityDetails = (
    capability: DetailedCapability,
    title: string
  ) => (
    <Card className="p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-indigo-600">Current Level</h4>
          <Progress
            value={(capability.current_proficiency_level / 5) * 100}
            className="mt-2"
          />
          <span className="text-sm text-gray-600">
            {capability.current_proficiency_level}/5
          </span>
        </div>

        <div>
          <h4 className="font-medium text-indigo-600">Strengths</h4>
          <p className="text-gray-700">{capability.strengths}</p>
        </div>

        <div>
          <h4 className="font-medium text-indigo-600">Development Areas</h4>
          <p className="text-gray-700">{capability.development_areas}</p>
        </div>

        <div>
          <h4 className="font-medium text-indigo-600">Recommendations</h4>
          <ul className="list-disc list-inside text-gray-700">
            {capability.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-indigo-600">Resources</h4>
          <p className="text-gray-700">{capability.resources}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => setSelectedPlan(null)}
        className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Plans
      </button>

      {/* Cover Section */}
      <Card className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h1 className="text-4xl font-bold mb-4">
          {plan.sections?.cover_page?.title || "Development Plan"}
        </h1>
        <p className="text-xl">{plan.sections?.cover_page?.participant_name}</p>
        <p className="text-sm opacity-80">
          Generated:{" "}
          {new Date(
            plan.sections?.cover_page?.assessment_date ||
              plan.metadata?.generated_date
          ).toLocaleDateString()}
        </p>
      </Card>

      {/* Personal Profile */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Personal Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-indigo-600">Career Context</h3>
            <p className="text-gray-700">
              {plan.sections?.personal_profile?.context_within_career_stage}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-indigo-600">Industry</h3>
              <p className="text-gray-700">
                {
                  plan.sections?.personal_profile
                    ?.demographic_information_analysis?.industry
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-600">Role</h3>
              <p className="text-gray-700">
                {
                  plan.sections?.personal_profile
                    ?.demographic_information_analysis?.["role/title"]
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-600">Company Size</h3>
              <p className="text-gray-700">
                {
                  plan.sections?.personal_profile
                    ?.demographic_information_analysis?.company_size
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-indigo-600">Experience</h3>
              <p className="text-gray-700">
                {
                  plan.sections?.personal_profile
                    ?.demographic_information_analysis?.years_of_experience
                }{" "}
                years
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Executive Summary */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          {plan.sections?.executive_summary?.overall_assessment}
        </p>
        <p className="text-indigo-600 font-medium">
          Focus Area:{" "}
          {plan.sections?.executive_summary?.high_level_development_focus}
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
            {plan.sections?.executive_summary?.key_strengths.map(
              (strength, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{strength.strength}</span>
                    <span className="text-green-600">{strength.score}/5</span>
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
            {plan.sections?.executive_summary?.development_areas.map(
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
            plan.sections?.assessment_overview?.capability_scores
          ).map(([capability, score], index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{capability}</span>
                <span className="text-indigo-600">{score}/5</span>
              </div>
              <Progress value={(score / 5) * 100} className="h-2 bg-gray-200" />
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Capability Analysis */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Detailed Capability Analysis
        </h2>
        {Object.entries(plan.sections?.detailed_capability_analysis).map(
          ([key, capability]) => renderCapabilityDetails(capability, key)
        )}
      </div>

      {/* Personal Development Planning */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Development Planning</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Short-term Actions
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {plan.sections?.personal_development_planning?.action_planning_guidance?.short_term_actions.map(
                (action, idx) => (
                  <li key={idx}>{action}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Long-term Actions
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {plan.sections?.personal_development_planning?.action_planning_guidance?.long_term_actions.map(
                (action, idx) => (
                  <li key={idx}>{action}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Success Metrics
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {plan.sections?.personal_development_planning?.success_metrics.map(
                (metric, idx) => (
                  <li key={idx}>{metric}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </Card>

      {/* Additional Support */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Additional Support</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Tips for Success
            </h3>
            <p className="text-gray-700">
              {plan.sections?.additional_support?.tips_for_development_success}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Learning Resources
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {plan.sections?.additional_support?.additional_learning_resources.map(
                (resource, idx) => (
                  <li key={idx}>{resource}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Common Challenges
            </h3>
            <p className="text-gray-700">
              {
                plan.sections?.additional_support
                  ?.common_challenges_and_solutions
              }
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Support Networks
            </h3>
            <p className="text-gray-700">
              {
                plan.sections?.additional_support
                  ?.support_networks_and_communities
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Conclusion */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Next Steps & Support</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Next Steps
            </h3>
            <p className="text-gray-700">
              {plan.sections?.conclusion?.next_steps_outline}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Support Contact
            </h3>
            <p className="text-gray-700">
              {plan.sections?.conclusion?.support_contact_information}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-indigo-600 mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-700">
              {plan.sections?.conclusion?.progress_tracking_suggestions}
            </p>
          </div>

          <div>
            <p className="text-lg font-medium text-indigo-600 mt-6 italic">
              {plan.sections?.conclusion?.motivational_closing_message}
            </p>
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <Card className="p-4 bg-gray-50">
        <div className="text-sm text-gray-500">
          <span className="mr-4">Version: {plan.metadata?.version}</span>
          <span className="mr-4">
            Participant ID: {plan.metadata?.participant_id}
          </span>
          <span>
            Generated:{" "}
            {new Date(plan.metadata?.generated_date).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </div>
  );
}
