import { Paper, Survey, WorkflowOptions } from './types';
import {
  PaperSchema,
  SurveySchema,
  WorkflowOptionsSchema,
  CreateSurveyRequestSchema,
} from './validation';
import { ZodError } from 'zod';

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Format Zod errors into readable messages
 */
const formatZodErrors = (error: ZodError): string[] => {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
};

/**
 * Validate paper metadata completeness
 * Ensures all required fields are present and valid
 */
export const validatePaperMetadata = (paper: unknown): ValidationResult<Paper> => {
  try {
    const validatedPaper = PaperSchema.parse(paper);
    return {
      success: true,
      data: validatedPaper,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
};

/**
 * Validate survey structure
 * Ensures survey has all required sections and proper format
 */
export const validateSurveyStructure = (survey: unknown): ValidationResult<Survey> => {
  try {
    const validatedSurvey = SurveySchema.parse(survey);

    // Additional business logic validation
    const errors: string[] = [];

    // Check that all sections have content
    validatedSurvey.content.sections.forEach((section, index) => {
      if (!section.title.trim()) {
        errors.push(`Section ${index + 1}: Title cannot be empty`);
      }
      if (!section.content.trim()) {
        errors.push(`Section ${index + 1}: Content cannot be empty`);
      }
    });

    // Check that introduction and conclusion are not empty
    if (!validatedSurvey.content.introduction.trim()) {
      errors.push('Introduction cannot be empty');
    }
    if (!validatedSurvey.content.conclusion.trim()) {
      errors.push('Conclusion cannot be empty');
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: validatedSurvey,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
};

/**
 * Validate workflow options
 * Ensures options are within acceptable ranges
 */
export const validateWorkflowOptionsData = (
  options: unknown
): ValidationResult<WorkflowOptions> => {
  try {
    const validatedOptions = WorkflowOptionsSchema.parse(options);
    return {
      success: true,
      data: validatedOptions,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
};

/**
 * Validate create survey request
 * Ensures topic and options are valid
 */
export const validateCreateSurveyRequestData = (data: unknown): ValidationResult<{
  topic: string;
  options?: WorkflowOptions;
}> => {
  try {
    const validated = CreateSurveyRequestSchema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
};

/**
 * Check if paper has all required metadata fields
 */
export const hasPaperMetadataComplete = (paper: Partial<Paper>): boolean => {
  const requiredFields: (keyof Paper)[] = [
    'title',
    'authors',
    'abstract',
    'publicationYear',
    'citationCount',
  ];

  return requiredFields.every((field) => {
    const value = paper[field];
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  });
};

/**
 * Check if survey has complete structure
 */
export const hasSurveyCompleteStructure = (survey: Partial<Survey>): boolean => {
  if (!survey.content) return false;

  const { introduction, sections, conclusion, references } = survey.content;

  // Check all required sections exist
  if (!introduction || !sections || !conclusion || !references) return false;

  // Check sections array has at least one section
  if (!Array.isArray(sections) || sections.length === 0) return false;

  // Check references array has at least one reference
  if (!Array.isArray(references) || references.length === 0) return false;

  return true;
};
