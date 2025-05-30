// services/question.ts
import axios from '../lib/axios';

export interface Question {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  commentCount: number;
}

// Question 생성 요청 인터페이스
export const getQuestions = async (): Promise<Question[]> => {
  const response = await axios.get('/questions');
  return response.data;
};
