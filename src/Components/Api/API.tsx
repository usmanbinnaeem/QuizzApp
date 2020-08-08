import { shuffleArray } from "../Utilities/Utilities";

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type CategoryType = {
  id: number;
  name: string;
};

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type QuestionState = {
  correct_answer: string;
  answers: string[];
  question: string;
  category: string;
};

export const fetchQuizQuestions = async (
  Tqustions: number,
  category: number,
  difficulty: string,
  type: string
): Promise<QuestionState[]> => {
  const endpoint = `https://opentdb.com/api.php?amount=${Tqustions}&difficulty=${difficulty}&type=${type}&category=${category}`;
  const data = await (await fetch(endpoint)).json();
  const quizQuestions: QuestionState[] = data.results.map(
    (question: Question) => {
      return {
        ...question,
        answers: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]),
        category: question.category,
      };
    }
  );

  return quizQuestions;
};

export const getCategory = async (): Promise<CategoryType[]> => {
  const res = await fetch("https://opentdb.com/api_category.php");
  let { trivia_categories } = await res.json();
  console.log(trivia_categories);
  return trivia_categories;
};
