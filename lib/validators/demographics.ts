import * as z from "zod";

export const demographicSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  department: z.string().min(1),
  jobTitle: z.string().min(1),
  directReports: z.string().transform((val) => String(val)),
  decisionLevel: z.string().min(1),
  typicalProject: z.string().min(1),
  levelsToCEO: z.string().transform((val) => String(val)),
  managesBudget: z.boolean(),
});
