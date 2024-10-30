DataBase Steup:
npx prisma init
npx prisma generate
npx prisma db push
npx prisma migrate dev

# First verify the database connection

npm run verify-db

# If that works, then run the full setup

npm run db:setup

# API Routes

## /api/assessment/classify

This route is used to classify the responsibility level of an employee based on their demographics.

```
POST /api/assessment/classify
```

Request Body:

```
{
  "name": "Rahees Ahmed",
    "industry": "IT",
    "companySize": "600",
    "department": "Finance",
    "jobTitle": "Financial Analyst",
    "directReports": "5",
    "decisionLevel": "Strategic",
    "typicalProject": "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
    "levelsToCEO": "2",
    "managesBudget": true
}
```

Response:

```
{
  "success": true,
  "data": {
    "assessmentId": "393dd2f1-7f34-43bc-8b28-8bad234d6c12",
    "responsibilityLevel": "Senior Director",
    "demographics": {
      "name": "Rahees Ahmed",
      "industry": "IT",
      "jobTitle": "Financial Analyst",
      "department": "Finance",
      "companySize": 600,
      "decisionLevel": "Strategic",
      "directReports": 5,
      "reportingRoles": [],
      "typicalProject": "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
      "levelsToExecutive": 2,
      "budgetResponsibility": {
        "manages": true
      }
    },
    "nextStep": "background"
  }
}
```

## Chat Route

Chat route is used to chat with the assistant.

```
POST /api/chat
```

Request Body:

```json
{
  "query": "What you can do for me?"
}
```

## api/assessment/about

This route is used to get the about questions.

```
GET /api/assessment/about
```

## api/assessment/about/[level]

This route is used to get the about questions for a given level.

```
GET /api/assessment/about/[level]
```

## api/assessment/questions

This route is used to get the questions for the assessment.

```
GET /api/assessment/questions
```

## api/assessment/questions/[level]

This route is used to get the questions for the assessment for a given level.

```
GET /api/assessment/questions/[level]
```

## api/assessment/demographic-questions

This route is used to get the demographic questions.

```
GET /api/assessment/demographic-questions
```

Example Response:

```json
{
  "demographicQuestions": [
    {
      "id": "name",
      "question": "Please enter what name you’d like to use in your report.",
      "type": "text",
      "placeholder": "Short Answer"
    },
    {
      "id": "industry",
      "question": "Please specify the industry your organization operates within.",
      "type": "text",
      "placeholder": "Healthcare, Technology, Manufacturing, or Education"
    },
    {
      "id": "companySize",
      "question": "Please enter the total number of employees in your entire organization.",
      "type": "number",
      "placeholder": "500"
    },
    {
      "id": "department",
      "question": "Please specify your primary department or division. For those with broader responsibilities, such as overseeing multiple areas or the entire organization, indicate the most encompassing area.",
      "type": "text",
      "placeholder": "Finance, Western Region Operations, or Company-wide"
    },
    {
      "id": "jobTitle",
      "question": "Please enter the exact title as used in your workplace.",
      "type": "text",
      "placeholder": "Enter your exact job title"
    },
    {
      "id": "directReports",
      "question": "How many people report directly to you?",
      "type": "number",
      "placeholder": "0"
    },
    {
      "id": "directReportRoles",
      "question": "What types of roles report directly to you? Please list them. If none, please state 'None'.",
      "type": "text",
      "placeholder": "Manager of Engineering, Sales Coordinator"
    },
    {
      "id": "decisionLevel",
      "question": "What level of decisions do you primarily make? (Please select the most appropriate option)",
      "type": "select",
      "options": [
        {
          "value": "operational",
          "label": "Operational (day-to-day decisions within your specific role, like processing invoices, responding to customer queries, or maintaining records)"
        },
        {
          "value": "tactical",
          "label": "Tactical (medium-term decisions affecting your team or department, such as improving workflow efficiency or determining project timelines)"
        },
        {
          "value": "strategic",
          "label": "Strategic (long-term decisions that shape major aspects of the organization, such as developing new company-wide programs, setting overarching business strategies, or leading major organizational changes)"
        }
      ]
    },
    {
      "id": "typicalProject",
      "question": "Describe a typical project or task you are responsible for. Please include details about what the task involves, any teams or departments you interact with, and its impact on your organization.",
      "type": "textarea",
      "placeholder": "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them."
    },
    {
      "id": "levelsToCEO",
      "question": "How many levels are there between you and the highest-ranking executive in your organization?",
      "type": "number",
      "placeholder": "3"
    },
    {
      "id": "managesBudget",
      "question": "Does your role require you to manage a budget? If so, is it for your department or across multiple departments?",
      "type": "boolean",
      "additionalInfo": {
        "type": "text",
        "question": "If Yes, please specify whether it is for your department only or if it spans multiple departments. Example: 'Yes, I manage the budget for the entire marketing department.'",
        "placeholder": "Yes, I manage the budget for the entire marketing department."
      }
    }
  ]
}
```

## api/development-plan/recommendations

This route is used to get the recommendations for the development plan.

Request Body:

```json
{
  "name": "Mike Johnson",
  "currentLevel": "L5",
  "targetLevel": "L7",
  "roleDetails": "Senior Manager",
  "industry": "Finance",
  "yearsExperience": 12,
  "currentRoleDescription": "Senior Manager of Investment Banking Division",
  "targetRoleDescription": "Senior Director of Global Operations",
  "focusAreas": ["Strategic Leadership", "Managing the Business"],
  "timeline": 36,
  "competencyRatings": {
    "Building a Team": 4,
    "Developing Others": 4,
    "Leading a Team to Get Results": 4,
    "Managing Performance": 4,
    "Managing the Business": 3,
    "Personal Development": 4,
    "Communicating as a Leader": 3,
    "Creating the Environment": 4
  }
}
```
