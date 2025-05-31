'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { postService, Post } from '@/services/postService';

interface PostData {
  title: string;
  nickname: string;
  password: string;
  content: string;
}

export default function Write() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEdit = !!postId;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostData>();

  useEffect(() => {
    if (isEdit && postId) {
      postService
        .getPost(Number(postId))
        .then((post) => {
          setValue('title', post.title);
          setValue('nickname', post.nickname);
          setValue('content', post.content);
        })
        .catch((err) => {
          console.error('폼 불러오기 실패:', err);
        });
    }
  }, [isEdit, postId, setValue]);

  const onSubmit = async (data: PostData) => {
    try {
      if (isEdit && postId) {
        await postService.updatePost(Number(postId), {
          title: data.title,
          content: data.content,
          password: data.password,
        });
        alert('폼 수정완료');
      } else {
        await postService.createPost({
          title: data.title,
          content: data.content,
          nickname: data.nickname,
          password: data.password,
        });
        alert('폼 작성완료');
      }
      router.push('/');
    } catch (error) {
      console.error('요청 실패:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[rgb(117,181,237)] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white border-2 border-[rgb(0, 0, 0)] rounded-lg p-8 shadow-md"
      >
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">
          ← 이전으로
        </Link>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-semibold mb-1">
              제목
            </label>
            <input
              id="title"
              placeholder="제목을 입력하세요"
              {...register('title', { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">제목을 입력해주세요.</p>
            )}
          </div>

          <div>
            <label htmlFor="nickname" className="text-sm font-semibold mb-1">
              닉네임
            </label>
            <input
              id="nickname"
              placeholder="닉네임을 입력하세요"
              {...register('nickname', { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1">
                닉네임을 입력해주세요.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              {...register('password', { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                비밀번호를 입력해주세요.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="text-sm font-semibold mb-1">
              내용
            </label>
            <textarea
              id="content"
              placeholder="내용을 입력하세요"
              rows={10}
              {...register('content', { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">내용을 입력해주세요.</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-[rgb(80,147,234)] text-white px-4 py-2 rounded hover:bg-[rgb(44,120,221)]"
            >
              {isEdit ? '수정하기' : '작성하기'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
