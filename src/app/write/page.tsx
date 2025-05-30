'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPost, createPost, updatePost, Post } from '@/services/postService';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEdit && postId) {
        try {
          setIsLoading(true);
          setError(null);
          const post = await getPost(parseInt(postId));
          setForm({
            title: post.title,
            author: post.author,
            password: '',
            content: post.content,
          });
        } catch (err) {
          setError('게시글을 불러오는데 실패했습니다.');
          console.error('Error fetching post:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEdit, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      if (isEdit && postId) {
        await updatePost({
          id: parseInt(postId),
          ...form,
        });
      } else {
        await createPost(form);
      }

      router.push('/');
    } catch (err) {
      setError('게시글 저장에 실패했습니다.');
      console.error('Error saving post:', err);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

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
              disabled={isLoading}
            >
              {isEdit ? '수정하기' : '작성하기'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
