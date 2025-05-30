'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PostForm {
  title: string;
  author: string;
  password: string;
  content: string;
}

export default function Write() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEdit = !!postId;

  const [form, setForm] = useState<PostForm>({
    title: '',
    author: '',
    password: '',
    content: '',
  });

  useEffect(() => {
    if (isEdit) {
      // 수정 시 기존 게시글 데이터 가져오기
      // 임시 데이터 (나중에 API 연동 시 제거)
      setForm({
        title: '기존 게시글 제목',
        author: '기존 작성자',
        password: '',
        content: '기존 게시글 내용',
      });
    }
  }, [isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 게시글 작성/수정 로직 구현
    router.push('/');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? '게시글 수정' : '게시글 작성'}
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              닉네임
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={10}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Link
              href="/"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              취소
            </Link>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEdit ? '수정하기' : '작성하기'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
