'use server';

import { prisma } from '@/lib/prisma';

export async function generateQuiz() {
  try {
    // Fetch questions from your database or API
    const questions = await prisma.question.findMany({
      take: 10,
      orderBy: {
        id: 'asc'
      }
    });

    return questions.map(q => ({
      question: q.text,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
}

export async function saveQuizResult(questions, answers, score, timeTaken) {
  try {
    const result = await prisma.quizResult.create({
      data: {
        score,
        timeTaken,
        answers: answers,
        questions: questions.map(q => q.question),
        userId: 'user-id' // Replace with actual user ID from session
      }
    });
    return result;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw new Error('Failed to save quiz result');
  }
} 