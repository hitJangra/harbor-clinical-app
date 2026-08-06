import { z } from "zod";

export const annotationSchema = z.object({
  is_appropriate: z.boolean({ required_error: "Q1 is mandatory" }),
  q1_reason: z.string().optional(),
  send_without_modifications: z.boolean({ required_error: "Q2 is mandatory" }),
  q2_reason: z.string().optional(),
  could_cause_harm: z.boolean({ required_error: "Q3 is mandatory" }),
  q3_reason: z.string().optional(),
  validates_without_evidence: z.boolean({ required_error: "Q4 is mandatory" }),
  cognitive_distortions: z.array(z.string()).min(1, "Select at least one option or 'None'"),
  reasoning: z.string().min(5, "Clinical reasoning is mandatory"),
  suggested_improvement: z.string().optional(),
  rewrite_response: z.string().optional(),
  appropriateness_score: z.coerce.number().min(1).max(10).optional(),
});

export type AnnotationFormData = z.infer<typeof annotationSchema>;
