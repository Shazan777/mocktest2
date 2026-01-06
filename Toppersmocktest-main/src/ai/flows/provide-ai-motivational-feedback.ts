'use server';
/**
 * @fileOverview This file defines a Genkit flow to provide AI-generated motivational feedback to students after a mock test.
 *
 * - provideAIMotivationalFeedback - A function that takes student performance data and returns motivational feedback.
 * - MotivationalFeedbackInput - The input type for the provideAIMotivationalFeedback function.
 * - MotivationalFeedbackOutput - The return type for the provideAIMotivationalFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalFeedbackInputSchema = z.object({
  score: z.number().describe('The student\u0027s score on the mock test (out of 20).'),
  accuracy: z.number().describe('The student\u0027s accuracy percentage on the mock test.'),
  correctAnswers: z.number().describe('The number of correct answers the student got.'),
  wrongAnswers: z.number().describe('The number of wrong answers the student got.'),
  skippedAnswers: z.number().describe('The number of skipped answers by the student.'),
  timeTaken: z.number().describe('The time taken by the student to complete the test in minutes.'),
  difficultyPerformance: z
    .object({
      easy: z.number().describe('The number of easy questions answered correctly.'),
      medium: z.number().describe('The number of medium questions answered correctly.'),
      hard: z.number().describe('The number of hard questions answered correctly.'),
    })
    .describe('The student\u0027s performance on questions of different difficulty levels.'),
});
export type MotivationalFeedbackInput = z.infer<typeof MotivationalFeedbackInputSchema>;

const MotivationalFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-generated motivational feedback for the student.'),
});
export type MotivationalFeedbackOutput = z.infer<typeof MotivationalFeedbackOutputSchema>;

export async function provideAIMotivationalFeedback(
  input: MotivationalFeedbackInput
): Promise<MotivationalFeedbackOutput> {
  return provideAIMotivationalFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalFeedbackPrompt',
  input: {schema: MotivationalFeedbackInputSchema},
  output: {schema: MotivationalFeedbackOutputSchema},
  prompt: `You are an AI-powered educational assistant providing motivational feedback to a student after they have completed a mock test.

  Based on their performance, offer specific encouragement and learning advice.

  Here's the student's performance data:
  - Score: {{score}}/20
  - Accuracy: {{accuracy}}%
  - Correct Answers: {{correctAnswers}}
  - Wrong Answers: {{wrongAnswers}}
  - Skipped Answers: {{skippedAnswers}}
  - Time Taken: {{timeTaken}} minutes
  - Difficulty Performance: Easy: {{difficultyPerformance.easy}}, Medium: {{difficultyPerformance.medium}}, Hard: {{difficultyPerformance.hard}}

  Focus on:
  - Highlighting strengths and areas of improvement.
  - Providing actionable learning advice.
  - Maintaining a positive and encouraging tone.

  Provide feedback that is specific and tailored to the student's performance.
  The feedback should be concise and easy to understand.
  The feedback should be no more than 150 words.
`,
});

const provideAIMotivationalFeedbackFlow = ai.defineFlow(
  {
    name: 'provideAIMotivationalFeedbackFlow',
    inputSchema: MotivationalFeedbackInputSchema,
    outputSchema: MotivationalFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
