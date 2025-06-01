'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';

interface PostData {
  title: string;
  nickname: string; // 변경된 부분
  password: string;
  content: string;
}

function PageInner() {
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

  const apiURL = 'http://localhost:8080';

  useEffect(() => {
    const fetchPostData = async () => {
      if (isEdit && postId) {
        try {
          const response = await axios.get(`${apiURL}/v1/questions/${postId}`);
          const post = response.data;

          // 🔽 react-hook-form에 값 설정
          setValue('title', post.title);
          setValue('nickname', post.nickname);
          setValue('content', post.content);
        } catch (error: any) {
          console.error(
            '게시글 불러오기 실패:',
            error.response?.data || error.message
          );
          alert('게시글을 불러오는 데 실패했습니다.');
        }
      }
    };

    fetchPostData();
  }, [isEdit, postId, setValue]);

  // 🔽 여기에 이거 덮어쓰기!
  const onSubmit = async (data: PostData) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
      if (isEdit && postId) {
        const pwFromURL = searchParams.get('pw');
        if (!pwFromURL) {
          alert('비밀번호가 없습니다.');
          return;
        }

        // 🔽 요청에 포함될 데이터: 기존 작성된 내용 + URL에서 가져온 비밀번호로 덮어쓰기
        const requestData = {
          title: data.title,
          nickname: data.nickname,
          content: data.content,
          password: pwFromURL || data.password,
        };

        await axios.put(`${apiURL}/v1/questions/${postId}`, requestData, {
          headers,
        });
        alert('폼 수정완료');
      } else {
        await axios.post(`${apiURL}/v1/questions`, data, { headers });
        alert('폼 작성완료');
      }

      router.push('/');
    } catch (error: any) {
      console.error('요청 실패:', error.response?.data || error.message);
      alert(
        '서버 오류 발생: ' +
          (error.response?.data?.message || '알 수 없는 오류')
      );
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

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PageInner />
    </Suspense>
  );
}
