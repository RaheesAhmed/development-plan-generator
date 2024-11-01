export interface DevelopmentPlan {
  metadata: {
    version: string;
    generated_date: string;
    participant_id: string;
  };
  sections: {
    cover_page: {
      title: string;
      participant_name: string;
      assessment_date: string;
    };
    executive_summary: {
      overall_assessment: string;
      key_strengths: Array<{ strength: string; score: number }>;
      development_areas: Array<{ area: string; score: number }>;
    };
    personal_profile: {
      professional_background_summary: string;
      current_role_context: string;
      target_role_implications: string;
      industry_specific_considerations: string;
      development_journey_context: string;
    };
    assessment_overview: {
      capability_scores: Record<string, number>;
      pattern_analysis: string;
      skill_vs_confidence_comparison: string;
      impact_analysis_for_target_role: string;
    };
    detailed_capability_analysis: Record<
      string,
      {
        importance: string;
        score_analysis: string;
        strengths: string;
        development_areas: string;
        recommendations: string[];
        resources: string;
      }
    >;
    development_planning: {
      goal_setting_framework: {
        examples: string[];
      };
      action_planning_structure: {
        short_term_actions: string[];
        long_term_actions: string[];
      };
      timeline_recommendations: string;
      progress_tracking_methods: string;
      success_metrics: string[];
    };
    support_resources: {
      success_strategies: string;
      challenge_mitigation_approaches: string;
      resource_recommendations: string[];
      learning_pathways: string;
    };
    conclusion: {
      motivational_summary: string;
      clear_next_steps: string;
      progress_review_recommendations: string;
      support_contact_information: string;
    };
  };
}
