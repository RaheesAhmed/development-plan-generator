"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Lock, ArrowRight, Info } from "lucide-react";

// Complete endpoints data structure
const endpoints = {
  "/api/assessment/demographic": {
    method: "GET",
    description: "Get demographic questions",
  },
  "/api/classify": {
    method: "POST",
    description: "Classify responsibility level",
    exampleRequest: {
      name: "John Doe",
      industry: "Healthcare",
      companySize: "500",
      department: "Finance",
      jobTitle: "Financial Analyst",
      directReports: "3",
      decisionLevel: "Strategic",
      typicalProject:
        "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
      levelsToCEO: "3",
      managesBudget: true,
    },
  },
  "/api/assessment/questions": {
    method: "GET",
    description: "Get assessment questions",
  },
  "/api/assessment/questions/:level": {
    method: "POST",
    description: "Get assessment questions by level",
    exampleRequest: {
      level: "4",
    },
  },
  "/api/assessment/about": {
    method: "GET",
    description: "Get questions about assessment",
  },
  "/api/assessment/about-questions/:level": {
    method: "POST",
    description: "Get questions about assessment by level",
    exampleRequest: {
      level: "4",
    },
  },
  "/api/session": {
    method: "POST",
    description: "Start a new leadership development session",
    exampleRequest: {
      name: "John Doe",
      currentLevel: "L4",
      targetLevel: "L6",
      roleDetails: "Regional Sales Manager",
      industry: "Technology",
      yearsExperience: 8,
      currentRoleDescription: "Managing regional sales team of 15 people",
      targetRoleDescription: "Director of Sales Operations",
      focusAreas: ["Building a Team", "Strategic Leadership"],
      timeline: 24,
      competencyRatings: {
        "Building a Team": 3,
        "Developing Others": 4,
        "Leading a Team to Get Results": 3,
        "Managing Performance": 4,
        "Managing the Business": 3,
        "Personal Development": 4,
        "Communicating as a Leader": 3,
        "Creating the Environment": 3,
      },
    },
  },
  "/api/plan": {
    method: "POST",
    description: "Generate a gap analysis",
    exampleRequest: {
      name: "Jane Smith",
      currentLevel: "L3",
      targetLevel: "L5",
      roleDetails: "Team Lead",
      industry: "Healthcare",
      yearsExperience: 5,
      currentRoleDescription: "Leading a team of 8 healthcare professionals",
      targetRoleDescription: "Senior Manager of Clinical Operations",
      focusAreas: ["Managing Performance", "Strategic Planning"],
      timeline: 18,
      competencyRatings: {
        "Building a Team": 3,
        "Developing Others": 3,
        "Leading a Team to Get Results": 4,
        "Managing Performance": 3,
        "Managing the Business": 2,
        "Personal Development": 4,
        "Communicating as a Leader": 3,
        "Creating the Environment": 3,
      },
    },
  },
  "/api/recommendations": {
    method: "POST",
    description: "Generate leadership recommendations",
    exampleRequest: {
      name: "Mike Johnson",
      currentLevel: "L5",
      targetLevel: "L7",
      roleDetails: "Senior Manager",
      industry: "Finance",
      yearsExperience: 12,
      currentRoleDescription: "Senior Manager of Investment Banking Division",
      targetRoleDescription: "Senior Director of Global Operations",
      focusAreas: ["Strategic Leadership", "Managing the Business"],
      timeline: 36,
      competencyRatings: {
        "Building a Team": 4,
        "Developing Others": 4,
        "Leading a Team to Get Results": 4,
        "Managing Performance": 4,
        "Managing the Business": 3,
        "Personal Development": 4,
        "Communicating as a Leader": 3,
        "Creating the Environment": 4,
      },
    },
  },
  "/api/chat": {
    method: "POST",
    description: "Start a chat with the AI",
    exampleRequest: {
      query: "Hello Who are You what you can guide me?",
    },
  },
  "/api/plan-rag": {
    method: "POST",
    description: "Generate a development plan with RAG",
    exampleRequest: {
      name: "Mike Johnson",
      currentLevel: "L5",
      targetLevel: "L7",
      roleDetails: "Senior Manager",
      industry: "Finance",
      yearsExperience: 12,
      currentRoleDescription: "Senior Manager of Investment Banking Division",
      targetRoleDescription: "Senior Director of Global Operations",
      focusAreas: ["Strategic Leadership", "Managing the Business"],
      timeline: 36,
      competencyRatings: {
        "Building a Team": 4,
        "Developing Others": 4,
        "Leading a Team to Get Results": 4,
        "Managing Performance": 4,
        "Managing the Business": 3,
        "Personal Development": 4,
        "Communicating as a Leader": 3,
        "Creating the Environment": 4,
      },
    },
  },
  "/api/auth/register": {
    method: "POST",
    description: "Register a new user",
    exampleRequest: {
      name: "rahees",
      email: "rahees2@gmail.com",
      password: "Abc123456789",
      role: "developer",
      department: "IT",
    },
  },
  "/api/auth/login": {
    method: "POST",
    description: "Login existing user",
    exampleRequest: {
      email: "rahees@gmail.com",
      password: "abc123",
    },
  },
  "/api/development-plan/generate": {
    method: "POST",
    description: "Generate development plan (requires authentication token)",
    authentication: "Bearer Token required",
    exampleRequest: {
      name: "Jane Smith",
      currentLevel: "L3",
      targetLevel: "L5",
      roleDetails: "Team Lead",
      industry: "Healthcare",
      yearsExperience: 5,
      currentRoleDescription: "Leading a team of 8 healthcare professionals",
      targetRoleDescription: "Senior Manager of Clinical Operations",
      focusAreas: ["Managing Performance", "Strategic Planning"],
      timeline: 18,
      competencyRatings: {
        "Building a Team": 3,
        "Developing Others": 3,
        "Leading a Team to Get Results": 4,
        "Managing Performance": 3,
        "Managing the Business": 2,
        "Personal Development": 4,
        "Communicating as a Leader": 3,
        "Creating the Environment": 3,
      },
    },
  },
};

const notes = [
  "All endpoints require Content-Type: application/json header",
  "All endpoints return a consistent response format with success/error status",
  "Leadership levels range from L1 (Individual Contributor) to L10 (Chief Officer)",
  "Competency ratings should be between 1-5",
  "All endpoints are protected by JWT authentication",
  "All endpoints are rate limited to 100 requests per 15 minutes",
  "All endpoints are cached for 1 hour",
  "All endpoints are protected by CORS",
  "All endpoints are protected by helmet",
  "All endpoints are protected by compression",
  "All endpoints are protected by cookie parser",
  "All endpoints are protected by express-rate-limit",
  "Authentication endpoints (/api/auth/*) do not require authentication",
  "Development plan endpoints require a valid JWT token in Authorization header",
];

const ApiDocs = () => {
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  const toggleEndpoint = (endpoint) => {
    setExpandedEndpoint(expandedEndpoint === endpoint ? null : endpoint);
  };

  const EndpointCard = ({ path, details }) => {
    const isExpanded = expandedEndpoint === path;

    return (
      <Card className="mb-4 overflow-hidden">
        <div
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-secondary/50"
          onClick={() => toggleEndpoint(path)}
        >
          <div className="flex items-center space-x-3">
            <Badge variant={details.method === "GET" ? "secondary" : "default"}>
              {details.method}
            </Badge>
            <span className="font-mono text-sm">{path}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {isExpanded && (
          <CardContent className="border-t bg-secondary/20">
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                {details.description}
              </p>

              {details.authentication && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Lock className="w-4 h-4" />
                  <span>{details.authentication}</span>
                </div>
              )}

              {details.exampleRequest && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Example Request:</h4>
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">
                      {JSON.stringify(details.exampleRequest, null, 2)}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Leadership Development API
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive API documentation for leadership assessment and
            development
          </p>
        </div>

        <Tabs defaultValue="endpoints" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <EndpointCard
                    path="/api/auth/register"
                    details={endpoints["/api/auth/register"]}
                  />
                  <EndpointCard
                    path="/api/auth/login"
                    details={endpoints["/api/auth/login"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <EndpointCard
                    path="/api/assessment/demographic"
                    details={endpoints["/api/assessment/demographic"]}
                  />
                  <EndpointCard
                    path="/api/assessment/questions"
                    details={endpoints["/api/assessment/questions"]}
                  />
                  <EndpointCard
                    path="/api/assessment/questions/:level"
                    details={endpoints["/api/assessment/questions/:level"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Development Planning Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <EndpointCard
                    path="/api/plan"
                    details={endpoints["/api/plan"]}
                  />
                  <EndpointCard
                    path="/api/plan-rag"
                    details={endpoints["/api/plan-rag"]}
                  />
                  <EndpointCard
                    path="/api/recommendations"
                    details={endpoints["/api/recommendations"]}
                  />
                  <EndpointCard
                    path="/api/development-plan/generate"
                    details={endpoints["/api/development-plan/generate"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interaction Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <EndpointCard
                    path="/api/chat"
                    details={endpoints["/api/chat"]}
                  />
                  <EndpointCard
                    path="/api/session"
                    details={endpoints["/api/session"]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;
