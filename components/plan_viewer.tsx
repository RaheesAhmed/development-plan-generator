"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Target,
  Briefcase,
  TrendingUp,
  Users,
  Brain,
  CheckCircle,
  BookOpen,
} from "lucide-react";

import { DevelopmentPlan } from "@/types/development_plan";

export default function DevelopmentPlanViewer(
  developmentPlanData: DevelopmentPlan
) {
  const { metadata, sections } = developmentPlanData;

  const renderProgressBar = (score: number) => (
    <div className="flex items-center space-x-2">
      <Progress value={(score / 5) * 100} className="w-full" />
      <span className="text-sm font-medium">{score}/5</span>
    </div>
  );

  const renderIcon = (name: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      "Building a Team": <Users className="w-6 h-6 text-blue-500" />,
      "Developing Others": <Brain className="w-6 h-6 text-green-500" />,
      "Leading a Team to Get Results": (
        <Target className="w-6 h-6 text-purple-500" />
      ),
      "Managing Performance": (
        <TrendingUp className="w-6 h-6 text-orange-500" />
      ),
      "Managing the Business": <Briefcase className="w-6 h-6 text-red-500" />,
      "Personal Development": <Star className="w-6 h-6 text-yellow-500" />,
      "Creating the Environment": (
        <CheckCircle className="w-6 h-6 text-teal-500" />
      ),
    };
    return icons[name] || <BookOpen className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {sections.cover_page.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-xl mb-2">
              {sections.cover_page.participant_name}
            </p>
            <p className="text-gray-600">
              Assessment Date: {sections.cover_page.assessment_date}
            </p>
            <p className="text-gray-600">
              Generated: {metadata.generated_date}
            </p>
            <p className="text-gray-600">Version: {metadata.version}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {sections.executive_summary.overall_assessment}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Strengths</h3>
                {sections.executive_summary.key_strengths.map(
                  (strength, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between  mb-1">
                        <span>{strength.strength}</span>
                        <Badge variant="secondary">{strength.score}/5</Badge>
                      </div>
                      {renderProgressBar(strength.score)}
                    </div>
                  )
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Development Areas
                </h3>
                {sections.executive_summary.development_areas.map(
                  (area, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span>{area.area}</span>
                        <Badge variant="secondary">{area.score}/5</Badge>
                      </div>
                      {renderProgressBar(area.score)}
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-500" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Professional Background
                </h3>
                <p>
                  {sections.personal_profile.professional_background_summary}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Role</h3>
                <p>{sections.personal_profile.current_role_context}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Target Role Implications
                </h3>
                <p>{sections.personal_profile.target_role_implications}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Industry Considerations
                </h3>
                <p>
                  {sections.personal_profile.industry_specific_considerations}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Development Journey
                </h3>
                <p>{sections.personal_profile.development_journey_context}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Target className="w-6 h-6 mr-2 text-purple-500" />
              Assessment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Capability Scores
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(
                    sections.assessment_overview.capability_scores
                  ).map(([capability, score]) => (
                    <div
                      key={capability}
                      className="flex items-center space-x-2"
                    >
                      {renderIcon(capability)}
                      <div className="flex-grow">
                        <div className="flex justify-between mb-1">
                          <span>{capability}</span>
                          <span>{score}/5</span>
                        </div>
                        {renderProgressBar(score)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pattern Analysis</h3>
                <p>{sections.assessment_overview.pattern_analysis}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Skill vs Confidence Comparison
                </h3>
                <p>
                  {sections.assessment_overview.skill_vs_confidence_comparison}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Impact Analysis for Target Role
                </h3>
                <p>
                  {sections.assessment_overview.impact_analysis_for_target_role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Capability Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Brain className="w-6 h-6 mr-2 text-green-500" />
              Detailed Capability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {Object.entries(sections.detailed_capability_analysis).map(
                ([capability, analysis]) => (
                  <div
                    key={capability}
                    className="mb-8 pb-4 border-b last:border-b-0"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      {renderIcon(capability)}
                      <span className="ml-2">{capability}</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Importance</h4>
                        <p>{analysis.importance}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Score Analysis</h4>
                        <p>{analysis.score_analysis}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Strengths</h4>
                        <p>{analysis.strengths}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Development Areas</h4>
                        <p>{analysis.development_areas}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Recommendations</h4>
                        <ul className="list-disc pl-5">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold">Resources</h4>
                        <p>{analysis.resources}</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Development Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
              Development Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Goal Setting Framework
                </h3>
                <ul className="list-disc pl-5">
                  {sections.development_planning.goal_setting_framework.examples.map(
                    (example, index) => (
                      <li key={index}>{example}</li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Action Planning</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Short-term Actions</h4>
                    <ul className="list-disc pl-5">
                      {sections.development_planning.action_planning_structure.short_term_actions.map(
                        (action, index) => (
                          <li key={index}>{action}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Long-term Actions</h4>
                    <ul className="list-disc pl-5">
                      {sections.development_planning.action_planning_structure.long_term_actions.map(
                        (action, index) => (
                          <li key={index}>{action}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Timeline Recommendations
                </h3>
                <p>{sections.development_planning.timeline_recommendations}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Progress Tracking Methods
                </h3>
                <p>{sections.development_planning.progress_tracking_methods}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Success Metrics</h3>
                <ul className="list-disc pl-5">
                  {sections.development_planning.success_metrics.map(
                    (metric, index) => (
                      <li key={index}>{metric}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-500" />
              Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Success Strategies
                </h3>
                <p>{sections.support_resources.success_strategies}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Challenge Mitigation Approaches
                </h3>
                <p>
                  {sections.support_resources.challenge_mitigation_approaches}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Resource Recommendations
                </h3>
                <ul className="list-disc pl-5">
                  {sections.support_resources.resource_recommendations.map(
                    (resource, index) => (
                      <li key={index}>{resource}</li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Learning Pathways
                </h3>
                <p>{sections.support_resources.learning_pathways}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-teal-500" />
              Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Motivational Summary
                </h3>
                <p>{sections.conclusion.motivational_summary}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                <p>{sections.conclusion.clear_next_steps}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Progress Review Recommendations
                </h3>
                <p>{sections.conclusion.progress_review_recommendations}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Support Contact Information
                </h3>
                <p>{sections.conclusion.support_contact_information}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
