'use server';
/**
 * @fileOverview Generates a unique set of 20 MCQ questions with a defined difficulty pattern.
 *
 * - generateUniqueMCQTest - A function that generates a set of MCQ questions.
 * - GenerateUniqueMCQTestInput - The input type for the generateUniqueMCQTest function.
 * - GenerateUniqueMCQTestOutput - The return type for the generateUniqueMCQTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUniqueMCQTestInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate questions.'),
  chapter: z.string().describe('The chapter for which to generate questions.'),
  easyCount: z.number().describe('The number of easy questions to generate.').default(5),
  mediumCount: z.number().describe('The number of medium questions to generate.').default(10),
  hardCount: z.number().describe('The number of hard questions to generate.').default(5),
});

export type GenerateUniqueMCQTestInput = z.infer<typeof GenerateUniqueMCQTestInputSchema>;

const MCQQuestionSchema = z.object({
  question: z.string().describe('The MCQ question text.'),
  options: z.array(z.string()).describe('The four options for the question.'),
  correctAnswer: z.string().describe('The correct answer among the options.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the question.'),
});

const GenerateUniqueMCQTestOutputSchema = z.array(MCQQuestionSchema);

export type GenerateUniqueMCQTestOutput = z.infer<typeof GenerateUniqueMCQTestOutputSchema>;

export async function generateUniqueMCQTest(input: GenerateUniqueMCQTestInput): Promise<GenerateUniqueMCQTestOutput> {
  return generateUniqueMCQTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUniqueMCQTestPrompt',
  input: {schema: GenerateUniqueMCQTestInputSchema},
  output: {schema: GenerateUniqueMCQTestOutputSchema},
  prompt: `You are an expert teacher generating Multiple Choice Questions (MCQs) for students.

  Generate a set of MCQs for the subject "{{subject}}", chapter "{{chapter}}".

The MCQs should follow this difficulty pattern:
- {{easyCount}} easy questions
- {{mediumCount}} medium questions
- {{hardCount}} hard questions

Each question must have four options, with only one correct answer.
Ensure the questions are unique and cover different concepts within the chapter.

Output the questions in JSON format. Each question should have the following keys:
- question: The MCQ question text.
- options: An array of four strings representing the options.
- correctAnswer: The correct answer among the options.
- difficulty: The difficulty level of the question (easy, medium, or hard).

Here's an example of the expected JSON format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Paris", "Rome", "Madrid"],
    "correctAnswer": "Paris",
    "difficulty": "easy"
  },
  // ... more questions
]
`,
});

const generateUniqueMCQTestFlow = ai.defineFlow(
  {
    name: 'generateUniqueMCQTestFlow',
    inputSchema: GenerateUniqueMCQTestInputSchema,
    outputSchema: GenerateUniqueMCQTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
