Users answer Level 1 questions based on identified capability areas.
Skill and confidence ratings are collected to assess perceived capabilities.
Decision to Develop Capability

Users are prompted to decide if they want to further develop their skills based on Level 1 responses.
Level 2 Questions

If users choose to develop, they answer specific Level 2 questions related to their response area.
Responses to these questions are analyzed for crafting a personalized development plan.
Customized Development Plan Generation

here is the flow how it will work:

1. User Experience Flow
   Demographic Information Entry: Create a section where participants enter their demographic information, including:

Name
Industry
Company Size
Department
Job Title
Number of Direct Reports
Types of Roles Reporting to Them
Level of Decisions (Operational, Tactical, Strategic)
Description of a Typical Project/Task
Levels to the CEO
Budget Management Requirement (boolean)
Background Information Options: Provide an option to either:

Learn about the background behind the assessment or
Skip directly to instructions.
Instructions Presentation: Once the background is skipped or reviewed, show instructions for taking the assessment.

2. Assessment Questions (Level 1 and Level 2)
   Level 1 Questions: Based on the assigned responsibility level, present the following questions for each capability area:

Skill Question: E.g., "How effectively do you guide your team in achieving their performance goals?"
Confidence Question: E.g., "Rate your confidence in positively influencing team performance."
Post-Level 1 Evaluation: After answering, check the participant's responses:

If Skill ≥ 4 and Confidence ≥ 3, thank them and proceed to the next area.
If Skill < 4 or Confidence < 3, ask: "Would you like to develop your skills in this area?"
If Yes: Take them to Level 2 Questions related to the capability area.
If No: Move to the next capability area.
Level 2 Questions: Define 3-5 focused questions for each capability area related to specific skills and experiences:"How do you set performance goals for your team members?"
"What methods do you use to provide constructive feedback?"

3. LLM Integration
   Data Collection for LLM: Once the demographic and assessment data is gathered:

Combine the participant's demographic info with their Level 1 and Level 2 responses.
Send this combined data to the LLM for analysis.
Knowledge Synthesis: Use the LLM to identify skills and confidence challenges, development opportunities, and generate tailored suggestions.

Here is the Already Done Code:
API Routes:
http://localhost:3000/api/assessment/classify

POST
BODY

```json
{
  "name": "John Doe",
  "industry": "Healthcare",
  "companySize": "500",
  "department": "Finance",
  "jobTitle": "Financial Analyst",
  "directReports": "3",
  "decisionLevel": "Strategic",
  "typicalProject": "I develop IT security policies that align with company-wide risk management strategies and coordinate with the legal and tech departments to implement them.",
  "levelsToCEO": "3",
  "managesBudget": true
}
```

Response
{
"success": true,
"data": {
"responsibilityLevel": 6,
"role": "Senior Director / Vice President",
"description": "Leads multiple departments or significant projects with a mix of strategic planning and operational management, typically with a handful of Directors and many Managers as direct reports.",
"versionInfo": {
"v1.0": "Signify a higher level of leadership within an organization. May have broader responsibilities and manage multiple directors or departments.",
"v2.0": "Provides leadership at a high level, often with responsibility for critical organizational policies and strategic direction. Manages multiple departments or large teams, typically with Directors or Managers reporting to them."
},
"nextStep": "background"
}
}

GET The Questions for the Assessment
http://localhost:3000/api/assessment/questions/level-one/level
example: http://localhost:3000/api/assessment/questions/level-one/6

GET

Response

```json
{
  "assessmentQuestionsByLevel": [
    {
      "area": "Building a Team",
      "questions": [
        {
          "question": "How effectively do you coordinate team tasks and support your team members to ensure collaboration and project success? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on your role in organizing team efforts and providing assistance. To what extent do your actions impact the overall success and cohesion of your team?",
          "ratingQuestion": "How effectively do you coordinate team tasks and support your team members to ensure collaboration and project success? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on your role in organizing team efforts and providing assistance. To what extent do your actions impact the overall success and cohesion of your team?",
          "reflection": "How confident do you feel in your ability to foster a positive team environment and guide your team towards common goals without formal authority? Rate from 1 (Not Confident) to 5 (Highly Confident).\n\nThink about your influence on team dynamics and morale. Evaluate your comfort level in leading through influence to achieve a unified team direction."
        }
      ]
    },
    {
      "area": "Developing Others",
      "questions": [
        {
          "question": "How effectively do you engage in informal peer mentoring and knowledge sharing within your team? Rate from 1 (Not Effectively) to 5 (Very Effectively).\"\n\nReflect on your interactions with team members where you provide guidance or share expertise. Consider how you foster a learning environment and encourage knowledge exchange. Think about specific instances where your mentoring or advice helped a team member overcome a challenge or improve their skills.",
          "ratingQuestion": "How effectively do you engage in informal peer mentoring and knowledge sharing within your team? Rate from 1 (Not Effectively) to 5 (Very Effectively).\"\n\nReflect on your interactions with team members where you provide guidance or share expertise. Consider how you foster a learning environment and encourage knowledge exchange. Think about specific instances where your mentoring or advice helped a team member overcome a challenge or improve their skills.",
          "reflection": "How confident do you feel in assisting your team members in navigating workplace challenges and decision-making processes? Rate from 1 (Not Confident) to 5 (Very Confident).\n\nThink about the times you've supported your team in resolving issues or making decisions. Assess the impact of your assistance: Did it lead to positive outcomes or learning experiences? Reflect on your approach to problem-solving and how you balance providing support with encouraging team members to develop their own solutions."
        }
      ]
    },
    {
      "area": "Leading a Team to Get Results",
      "questions": [
        {
          "question": "How effectively do you coordinate and manage tasks within your team to ensure timely and successful completion of projects? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nThink about the strategies you use for task distribution and oversight. Reflect on how you identify and address challenges in task management, and consider instances where your intervention improved the team's performance or helped overcome obstacles. How do your actions influence the team's ability to meet deadlines and achieve desired outcomes?",
          "ratingQuestion": "How effectively do you coordinate and manage tasks within your team to ensure timely and successful completion of projects? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nThink about the strategies you use for task distribution and oversight. Reflect on how you identify and address challenges in task management, and consider instances where your intervention improved the team's performance or helped overcome obstacles. How do your actions influence the team's ability to meet deadlines and achieve desired outcomes?",
          "reflection": "How confident do you feel in your ability to provide hands-on support and guidance to your team members, enhancing their performance and contribution to projects? Rate from 1 (Not Confident) to 5 (Very Confident).\n\nReflect on the level of support you offer to your team. Think about moments when your guidance was crucial for a team member's success or project completion. How do you adapt your support style to different individuals and situations? Consider how your support impacts the team's morale and productivity, and how confident you feel about your approach in these scenarios."
        }
      ]
    },
    {
      "area": "Managing Performance",
      "questions": [
        {
          "question": "On a scale of 1 (Not Effectively) to 5 (Very Effectively), how effectively do you guide and support your team members in achieving their performance goals, while also fostering a collaborative problem-solving environment?\n\nReflect on how you assist your team members in setting and understanding their goals. Consider your approach to providing feedback and how you encourage collaboration and problem-solving within your team. Think about instances where you have successfully supported your team members to overcome challenges and achieve their objectives.",
          "ratingQuestion": "On a scale of 1 (Not Effectively) to 5 (Very Effectively), how effectively do you guide and support your team members in achieving their performance goals, while also fostering a collaborative problem-solving environment?\n\nReflect on how you assist your team members in setting and understanding their goals. Consider your approach to providing feedback and how you encourage collaboration and problem-solving within your team. Think about instances where you have successfully supported your team members to overcome challenges and achieve their objectives.",
          "reflection": "Rate your confidence level from 1 (Not Confident) to 5 (Very Confident) in your ability to influence team performance positively and effectively, even without formal authority.\n\nThink about situations where you have motivated and guided your team towards improved performance. Reflect on your ability to lead by example and inspire your team members, despite not having formal managerial authority. Consider both the successes and challenges you've encountered in influencing your team and how these experiences have shaped your confidence."
        }
      ]
    },
    {
      "area": "Managing the Business",
      "questions": [
        {
          "question": "On a scale of 1 (Not Effective) to 5 (Highly Effective), how effectively do you coordinate your teams activities to align with the departments business goals and operational efficiency?\n\nReflect on how you plan and delegate tasks within your team. Consider instances where your coordination directly influenced the teams alignment with departmental objectives and enhanced operational efficiency. Think about the methods you use to ensure that every team members work contributes to the broader business aims.",
          "ratingQuestion": "On a scale of 1 (Not Effective) to 5 (Highly Effective), how effectively do you coordinate your teams activities to align with the departments business goals and operational efficiency?\n\nReflect on how you plan and delegate tasks within your team. Consider instances where your coordination directly influenced the teams alignment with departmental objectives and enhanced operational efficiency. Think about the methods you use to ensure that every team members work contributes to the broader business aims.",
          "reflection": "Rate your confidence from 1 (Not Confident) to 5 (Very Confident) in understanding and communicating the business context of your teams projects to your team members.\n\nThink about how you interpret and convey the business significance of projects to your team. Reflect on your ability to make project decisions that are informed by an understanding of how they fit into the wider business framework. Consider how confident you feel in guiding your team to align their efforts with the overarching business objectives."
        }
      ]
    },
    {
      "area": "Personal Development",
      "questions": [
        {
          "question": "How effectively do you apply practical leadership skills to develop yourself while managing your team's daily operations? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on how you've grown in your role as a Team Lead. Consider your day-to-day management of the team's operations: how have you turned these into opportunities for personal leadership development? Think about the strategies you've implemented for your growth, such as seeking feedback, learning from everyday challenges, and applying new leadership techniques with your team.",
          "ratingQuestion": "How effectively do you apply practical leadership skills to develop yourself while managing your team's daily operations? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on how you've grown in your role as a Team Lead. Consider your day-to-day management of the team's operations: how have you turned these into opportunities for personal leadership development? Think about the strategies you've implemented for your growth, such as seeking feedback, learning from everyday challenges, and applying new leadership techniques with your team.",
          "reflection": "How confident are you in your ability to enhance your leadership communication and project management skills as you lead your team? Rate from 1 (Not Confident) to 5 (Very Confident).\n\nConsider the last time you faced a complex project or communication challenge. How confident were you in your ability to handle it, and what did you learn from the experience that contributed to your personal development? Think about specific instances where you actively worked to improve your project management and communication skills through leading your team."
        }
      ]
    },
    {
      "area": "Creating the Environment",
      "questions": [
        {
          "question": "How effectively do you coordinate team tasks and foster a collaborative and compliant work environment, including facilitating team communication, resolving conflicts, and ensuring adherence to relevant employment guidelines? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on how you manage team projects and interactions. Think about your role in facilitating discussions and ensuring every team member feels heard. How do you handle situations of conflict or disagreement? Consider your understanding and application of employment guidelines in your daily team management  are you ensuring that team practices align with these guidelines? Evaluate your effectiveness in creating a collaborative, compliant, and harmonious work environment.",
          "ratingQuestion": "How effectively do you coordinate team tasks and foster a collaborative and compliant work environment, including facilitating team communication, resolving conflicts, and ensuring adherence to relevant employment guidelines? Rate from 1 (Not Effectively) to 5 (Very Effectively).\n\nReflect on how you manage team projects and interactions. Think about your role in facilitating discussions and ensuring every team member feels heard. How do you handle situations of conflict or disagreement? Consider your understanding and application of employment guidelines in your daily team management  are you ensuring that team practices align with these guidelines? Evaluate your effectiveness in creating a collaborative, compliant, and harmonious work environment.",
          "reflection": "How confident are you in your ability to manage team dynamics effectively, including promoting open communication, resolving minor conflicts, and applying employment-related practices in your team leadership? Rate from 1 (Not Confident) to 5 (Very Confident).\n\nConsider moments when you've had to lead team discussions, address conflicts, or guide your team in line with company policies and employment laws. How confident did you feel in these situations? Reflect on your ability to communicate transparently with your team and to handle disputes effectively. Think about your understanding of employment guidelines and how confidently you apply these in managing your team. Use these reflections to assess your confidence level in leading your team in a compliant and positive manner."
        }
      ]
    }
  ]
}
```

POST http://localhost:3000/api/assessment/questions/level-two

BODY

```json
{
  "level": 2,
  "capability": "Building a Team",
  "answers": {
    "skill": 4,
    "confidence": 3
  }
}
```

Response

```json
{
  "levelTwoQuestions": [
    {
      "id": "Building a Team-l2-0",
      "capability": "Building a Team",
      "level": 2,
      "question": "Regarding \"Task Coordination and Support: Organizing team activities and providing support where needed.\", please describe your specific challenges and experiences:",
      "theme": "Task Coordination and Support: Organizing team activities and providing support where needed.",
      "type": "detailed",
      "requiresReflection": true
    },
    {
      "id": "Building a Team-l2-1",
      "capability": "Building a Team",
      "level": 2,
      "question": "Regarding \"Influencing and Collaboration: Encouraging teamwork and cooperation without having formal authority.\", please describe your specific challenges and experiences:",
      "theme": "Influencing and Collaboration: Encouraging teamwork and cooperation without having formal authority.",
      "type": "detailed",
      "requiresReflection": true
    },
    {
      "id": "Building a Team-l2-2",
      "capability": "Building a Team",
      "level": 2,
      "question": "Regarding \"Team Cohesion and Direction: Helping to guide the team towards common goals and a shared vision.\", please describe your specific challenges and experiences:",
      "theme": "Team Cohesion and Direction: Helping to guide the team towards common goals and a shared vision.",
      "type": "detailed",
      "requiresReflection": true
    },
    {
      "id": "Building a Team-l2-3",
      "capability": "Building a Team",
      "level": 2,
      "question": "Regarding \"Positive Environment and Conflict Resolution: Contributing to a positive team atmosphere and helping to resolve conflicts that arise.\", please describe your specific challenges and experiences:",
      "theme": "Positive Environment and Conflict Resolution: Contributing to a positive team atmosphere and helping to resolve conflicts that arise.",
      "type": "detailed",
      "requiresReflection": true
    }
  ]
}
```

API Routes for the Development Plan
http://localhost:3000/api/assessment/generate
POST
BODY

```json
{
  "userInfo": {},
  "responsibilityLevel": {},
  "assessmentAnswers": {},
  "assessmentCompleted": {}
}
```

response
success: true, plan
