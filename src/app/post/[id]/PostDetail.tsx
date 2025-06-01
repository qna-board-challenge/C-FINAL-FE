"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  nickname: string;
  content: string;
  created: string;
  updated: string;
  views: number;
  commentCount: number;
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  created: string;
}

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [commentTotalPages, setCommentTotalPages] = useState(1);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [action, setAction] = useState<"edit" | "delete">("edit");

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentPassword, setCommentPassword] = useState("");

  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null
  );
  const [editContent, setEditContent] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string" || !/^\d+$/.test(id)) {
      router.push("/");
      return;
    }

    const fetchPostAndComments = async () => {
      try {
        const postRes = await fetch(`http://localhost:8080/v1/questions/${id}`);
        const postData = await postRes.json();
        setPost(postData);

        const commentRes = await fetch(
          `http://localhost:8080/v1/questions/comments/${id}?page=${commentPage}&size=5`
        );
        const commentData = await commentRes.json();
        setComments(commentData?.content ?? []);
        setCommentTotalPages(commentData?.totalPages ?? 1);
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };

    fetchPostAndComments();
  }, [id, router, commentPage]);

  const handleEdit = () => {
    setAction("edit");
    setShowPasswordModal(true);
  };

  const handleDelete = () => {
    setAction("delete");
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!post) return;
    if (action === "edit") {
      router.push(`/write?id=${post.id}&pw=${password}`);
    } else {
      try {
        axios.delete(`http://localhost:8080/v1/questions/${post.id}`, {
          data: { password },
        });
        alert("게시글이 삭제되었습니다.");
        router.push("/");
      } catch (err) {
        alert("삭제 실패: 비밀번호가 일치하지 않거나 서버 오류입니다.");
        console.error(err);
      }
    }
    setShowPasswordModal(false);
    setPassword("");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/v1/questions/comments/${id}`, {
        nickname: "익명",
        password: commentPassword,
        content: commentContent,
      });
      alert("댓글이 등록되었습니다.");
      setShowCommentForm(false);
      setCommentContent("");
      setCommentPassword("");
      setCommentPage(0);
    } catch (err) {
      alert("댓글 등록 실패");
      console.error(err);
    }
  };

  const handleCommentEdit = async () => {
    if (!selectedCommentId) return;
    try {
      axios.put(
        `http://localhost:8080/v1/questions/comments/${selectedCommentId}`,
        {
          nickname: "익명",
          content: editContent,
          password: editPassword,
        }
      );
      alert("댓글이 수정되었습니다.");
      setSelectedCommentId(null);
      setEditContent("");
      setEditPassword("");
      setCommentPage(0);
    } catch (err) {
      alert("수정 실패: 비밀번호가 틀리거나 오류 발생");
    }
  };

  const handleCommentDelete = async (commentId: number, password: string) => {
    try {
      axios.delete(`http://localhost:8080/v1/questions/comments/${commentId}`, {
        data: { password },
      });
      alert("댓글이 삭제되었습니다.");
      setCommentPage(0);
    } catch (err) {
      alert("삭제 실패: 비밀번호가 틀리거나 오류 발생");
    }
  };

  if (!post) return <div className="text-center mt-10">로딩 중...</div>;

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
            <span className="mr-4">작성자: {post.nickname}</span>
            <span className="mr-4">작성일: {post.created?.split("T")[0]}</span>
            {/* {post.updated != post.created && (
              <span className="mr-4">
                수정일: {post.updated?.split("T")[0]}
              </span>
            )} */}
          </div>
          <div>
            <span className="mr-4">조회수: {post.views}</span>
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
                <span className="font-semibold">{comment.nickname}</span>
                <span className="text-gray-600">
                  {comment.created?.split("T")[0]}
                </span>
              </div>
              <p>{comment.content}</p>
              <div className="flex space-x-2 mt-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedCommentId(comment.id);
                    setEditContent(comment.content);
                    setEditPassword("");
                  }}
                  className="text-blue-500"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    const pw = prompt("삭제하려면 비밀번호를 입력하세요:");
                    if (pw) handleCommentDelete(comment.id, pw);
                  }}
                  className="text-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 페이징 */}
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: commentTotalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                commentPage === i
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCommentPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* 댓글 작성 버튼 */}
        <button
          onClick={() => setShowCommentForm(true)}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          댓글 작성
        </button>

        {/* 댓글 수정 폼 */}
        {selectedCommentId && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="font-bold mb-2">댓글 수정</h4>
            <textarea
              className="w-full p-2 border rounded mb-2"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-2 border rounded mb-2"
              placeholder="비밀번호 입력"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCommentId(null)}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                onClick={handleCommentEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                수정 완료
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
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

      {/* 댓글 작성 폼 */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
