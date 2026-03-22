import { z } from 'zod';

// Author schema
export const AuthorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  affiliations: z.array(z.string()).optional(),
});

// Paper schema
export const PaperSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().min(1),
  title: z.string().min(1).max(500, 'Title must be less than 500 characters'),
  authors: z.array(AuthorSchema).min(1, 'At least one author is required'),
  abstract: z.string().min(1).max(5000, 'Abstract must be less than 5000 characters'),
  publicationYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear(), 'Publication year cannot be in the future'),
  citationCount: z.number().int().min(0, 'Citation count must be non-negative'),
  venue: z.string().min(1),
  url: z.string().url(),
  qualityScore: z.number().min(0).max(10).optional(),
  relevanceScore: z.number().min(0).max(10).optional(),
  themes: z.array(z.string()).optional(),
});

// Reference schema
export const ReferenceSchema = z.object({
  authors: z.array(z.string()).min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  title: z.string().min(1),
  venue: z.string().min(1),
  url: z.string().url().optional(),
});

// Survey section schema
export const SurveySectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
  paperIds: z.array(z.string().uuid()),
});

// Survey schema
export const SurveySchema = z.object({
  id: z.string().uuid(),
  executionId: z.string().uuid(),
  topic: z.string().min(1).max(500),
  content: z.object({
    introduction: z.string().min(1).max(2000, 'Introduction must be less than 2000 characters'),
    sections: z
      .array(SurveySectionSchema)
      .min(1, 'At least one section is required')
      .max(10, 'Maximum 10 sections allowed'),
    conclusion: z.string().min(1).max(2000, 'Conclusion must be less than 2000 characters'),
    references: z.array(ReferenceSchema).min(1, 'At least one reference is required'),
  }),
  metadata: z.object({
    paperCount: z.number().int().min(0),
    wordCount: z.number().int().min(0),
    generatedAt: z.date(),
    themes: z.array(z.string()),
  }),
});

// Workflow options schema
export const WorkflowOptionsSchema = z.object({
  maxPapers: z.number().int().min(5).max(50).optional().default(20),
  minCitationCount: z.number().int().min(0).max(100).optional().default(5),
  yearRange: z
    .object({
      start: z.number().int().min(1900).max(new Date().getFullYear()),
      end: z.number().int().min(1900).max(new Date().getFullYear()),
    })
    .refine((data) => data.start <= data.end, {
      message: 'Start year must be less than or equal to end year',
    })
    .optional(),
});

// Create survey request schema
export const CreateSurveyRequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(500, 'Topic must be less than 500 characters'),
  options: WorkflowOptionsSchema.optional(),
});

// Export request schema
export const ExportRequestSchema = z.object({
  surveyId: z.string().uuid('Invalid survey ID'),
  format: z.enum(['pdf', 'docx', 'json']),
});

// Validation helper functions
export const validatePaper = (data: unknown) => {
  return PaperSchema.parse(data);
};

export const validateSurvey = (data: unknown) => {
  return SurveySchema.parse(data);
};

export const validateWorkflowOptions = (data: unknown) => {
  return WorkflowOptionsSchema.parse(data);
};

export const validateCreateSurveyRequest = (data: unknown) => {
  return CreateSurveyRequestSchema.parse(data);
};

export const validateExportRequest = (data: unknown) => {
  return ExportRequestSchema.parse(data);
};
