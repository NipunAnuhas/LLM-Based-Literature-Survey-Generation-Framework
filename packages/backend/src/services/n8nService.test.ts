import { extractSurvey } from './n8nService';

/** Minimal payload matching Build Survey Payload + Respond JSON.stringify($json.survey) */
function shapeA() {
  return {
    content: {
      introduction: 'Introduction text.',
      sections: [
        {
          title: 'Selected papers and rationale',
          content: 'Section body.',
          paperIds: [] as string[],
        },
      ],
      conclusion: 'Conclusion text.',
      references: [
        {
          authors: ['Unknown'],
          year: 2026,
          title: 'Example Paper',
          venue: 'example.org',
          url: 'https://example.org/p/1',
        },
      ],
    },
    metadata: {
      paperCount: 1,
      wordCount: 12,
      generatedAt: new Date().toISOString(),
      themes: [] as string[],
    },
  };
}

describe('extractSurvey', () => {
  it('accepts shape A — parsed object with content.introduction and metadata.generatedAt', () => {
    const body = shapeA();
    const out = extractSurvey(body);
    expect(out).not.toBeNull();
    expect(out!.content.introduction).toBe(body.content.introduction);
    expect(out!.metadata.generatedAt).toBe(body.metadata.generatedAt);
  });

  it('accepts shape A as JSON string (axios text + manual parse)', () => {
    const body = shapeA();
    const out = extractSurvey(JSON.stringify(body));
    expect(out).not.toBeNull();
    expect(out!.metadata.paperCount).toBe(1);
  });

  it('accepts shape B — { survey: { content, metadata } }', () => {
    const survey = shapeA();
    const out = extractSurvey({ survey });
    expect(out).not.toBeNull();
    expect(out!.content.conclusion).toBe(survey.content.conclusion);
  });

  it('accepts double-encoded string of shape A', () => {
    const inner = JSON.stringify(shapeA());
    const out = extractSurvey(JSON.stringify(inner));
    expect(out).not.toBeNull();
  });

  it('returns null when metadata.generatedAt missing on shape A', () => {
    const bad = { ...shapeA(), metadata: { ...shapeA().metadata, generatedAt: undefined } };
    delete (bad.metadata as any).generatedAt;
    expect(extractSurvey(bad)).toBeNull();
  });
});
