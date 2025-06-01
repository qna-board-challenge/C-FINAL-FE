"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  nickname: string;
  created: string;
  content: string;
  commentCount: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "comment">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/v1/questions?sort=${sortBy}&page=${
            currentPage - 1
          }&size=${postsPerPage}`
        );
        const filtered = res.data.content.filter((post: Post) => post.id !== 1);
        setPosts(filtered);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, [sortBy, currentPage]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">게시판</h1>
        <Link
          href="/write"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="제목으로 검색"
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            sortBy === "latest" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setSortBy("latest");
            setCurrentPage(1);
          }}
        >
          최신순
        </button>
        <button
          className={`px-4 py-2 rounded ${
            sortBy === "comment" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setSortBy("comment");
            setCurrentPage(1);
          }}
        >
          댓글순
        </button>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Link
            href={`/post/${post.id}`}
            key={post.id}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>작성자: {post.nickname}</span>
              <span>
                작성일:{" "}
                {post.created ? post.created.split("T")[0] : "날짜 없음"}
              </span>
              <span>댓글: {post.commentCount}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </main>
  );
}
