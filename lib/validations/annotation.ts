import { z } from "zod";

export const annotationSchema = z.object({
  is_appropriate: z.boolean({ required_error: "Q1 is mandatory" }),
  send_without_modifications: z.boolean({ required_error: "Q2 is mandatory" }),
  could_cause_harm: z.boolean({ required_error: "Q3 is mandatory" }),
  validates_without_evidence: z.boolean({ required_error: "Q4 is mandatory" }),
  cognitive_distortions: z.array(z.string()).min(1, "Select at least one option or 'None'"),
  reasoning: z.string().min(5, "Clinical reasoning is mandatory"),
  suggested_improvement: z.string().optional(),
  rewrite_response: z.string().optional(),
});

export type AnnotationFormData = z.infer<typeof annotationSchema>;
