'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
  comments: Comment[];
}

export default function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [action, setAction] = useState<'edit' | 'delete'>('edit');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentPassword, setCommentPassword] = useState('');

  // 임시 데이터 (나중에 API 연동 시 제거)
  const post: Post = {
    id: parseInt(unwrappedParams.id),
    title: '게시글 제목',
    author: '작성자',
    content: '게시글 내용입니다.',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    viewCount: 100,
    commentCount: 2,
    comments: [
      {
        id: 1,
        content: '첫 번째 댓글입니다.',
        author: '댓글작성자1',
        createdAt: '2024-03-20',
      },
      {
        id: 2,
        content: '두 번째 댓글입니다.',
        author: '댓글작성자2',
        createdAt: '2024-03-20',
      },
    ],
  };

  const handleEdit = () => {
    setAction('edit');
    setShowPasswordModal(true);
  };

  const handleDelete = () => {
    setAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    // 비밀번호 확인 로직 구현
    if (action === 'edit') {
      router.push(`/write?id=${post.id}`);
    } else {
      // 삭제 로직 구현
      router.push('/');
    }
    setShowPasswordModal(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 댓글 작성 로직 구현
    setShowCommentForm(false);
    setCommentContent('');
    setCommentPassword('');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between text-gray-600 mb-4">
          <div>
            <span className="mr-4">작성자: {post.author}</span>
            <span className="mr-4">작성일: {post.createdAt}</span>
            <span className="mr-4">수정일: {post.updatedAt}</span>
          </div>
          <div>
            <span className="mr-4">조회수: {post.viewCount}</span>
            <span>댓글: {post.commentCount}</span>
          </div>
        </div>
        <div className="border-t border-b py-4 mb-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </article>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">댓글</h2>
        <div className="space-y-4 mb-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-gray-600">{comment.createdAt}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowCommentForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          댓글 작성
        </button>
      </section>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">비밀번호 입력</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="비밀번호를 입력하세요"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">댓글 작성</h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                rows={4}
                placeholder="댓글을 입력하세요"
                required
              />
              <input
                type="password"
                value={commentPassword}
                onChange={(e) => setCommentPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  작성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
