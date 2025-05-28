// components/QuestionList.tsx
'use client';

import { useEffect, useState } from 'react';
import { getQuestions, Question } from '../services/question';

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('질문 목록을 가져오는 데 실패했습니다.', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="p-4 border rounded-xl">
          <h2 className="text-xl font-semibold">{q.title}</h2>
          <p className="text-gray-600 text-sm">
            작성자: {q.author} | {new Date(q.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 truncate">{q.content}</p>
          <p className="text-sm text-right text-blue-500">
            💬 {q.commentCount}개
          </p>
        </div>
      ))}
    </div>
  );
}
