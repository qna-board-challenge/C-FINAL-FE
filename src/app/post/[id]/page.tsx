'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getPost,
  getComments,
  createComment,
  deletePost,
  Post,
  Comment,
  CommentCreateRequest,
} from '@/services/postService';

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [action, setAction] = useState<'edit' | 'delete'>('edit');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostAndComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [postData, commentsData] = await Promise.all([
        getPost(parseInt(params.id)),
        getComments(parseInt(params.id)),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [params.id]);

  const handleEdit = () => {
    setAction('edit');
    setShowPasswordModal(true);
  };

  const handleDelete = () => {
    setAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      if (action === 'edit') {
        router.push(`/write?id=${params.id}`);
      } else {
        await deletePost(parseInt(params.id), password);
        router.push('/');
      }
    } catch (err) {
      setError('비밀번호가 일치하지 않습니다.');
      console.error('Error:', err);
    } finally {
      setShowPasswordModal(false);
      setPassword('');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const commentData: CommentCreateRequest = {
        content: commentContent,
        author: '익명', // 또는 사용자 입력 필드 추가
        password: commentPassword,
      };
      await createComment(parseInt(params.id), commentData);
      await fetchPostAndComments();
      setShowCommentForm(false);
      setCommentContent('');
      setCommentPassword('');
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Error creating comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-4">{error}</div>
        <div className="text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

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
            <span className="mr-4">
              작성일: {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="mr-4">
              수정일: {new Date(post.updatedAt).toLocaleDateString()}
            </span>
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
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
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
