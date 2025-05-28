"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import { useForm } from "react-hook-form";

interface PostData {
  title: string;
  author: string;
  password: string;
  content: string;
}

export default function Write() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEdit = !!postId;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostData>();

  useEffect(() => {
    if (isEdit) {
      setValue("title", "기존 게시글 제목");
      setValue("author", "기존 작성자");
      setValue("password", "");
      setValue("content", "기존 게시글 내용");
    }
  }, [isEdit, setValue]);

  const onSubmit = (data: PostData) => {
    console.log("제출 데이터:", data);
    // TODO: API 요청 처리 (axios.post 또는 axios.put)


    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[rgb(117,181,237)] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white border-2 border-[rgb(0, 0, 0)] rounded-lg p-8 shadow-md"
      >

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-semibold mb-1">
              제목
            </label>
            <input
              id="title"
              placeholder="제목을 입력하세요"
              {...register("title", { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">제목을 입력해주세요.</p>
            )}
          </div>

          <div>
            <label htmlFor="author" className="text-sm font-semibold mb-1">
              닉네임
            </label>
            <input
              id="author"
              placeholder="닉네임을 입력하세요"
              {...register("author", { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.author && (
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
              {...register("password", { required: true })}
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
              {...register("content", { required: true })}
              className="w-full p-2 border rounded bg-[rgb(239,246,255)]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">내용을 입력해주세요.</p>
            )}
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
              className="bg-[rgb(80,147,234)] text-white px-4 py-2 rounded hover:bg-[rgb(44,120,221)]"
            >
              {isEdit ? "수정하기" : "작성하기"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}


