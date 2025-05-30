'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  commentCount: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'comments'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 임시 데이터 (나중에 API 연동 시 제거할 예정)
  const dummyPosts: Post[] = [
    {
      id: 1,
      title: '첫 번째 게시글입니다.',
      author: '작성자1',
      createdAt: '2024-03-20',
      content: '게시글 내용입니다.',
      commentCount: 5,
    },
    // 더 많은 더미 데이터 추가 가능
  ];

  const filteredPosts = dummyPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.commentCount - a.commentCount;
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
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
            sortBy === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSortBy('latest')}
        >
          최신순
        </button>
        <button
          className={`px-4 py-2 rounded ${
            sortBy === 'comments' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setSortBy('comments')}
        >
          댓글순
        </button>
      </div>

      <div className="space-y-4">
        {currentPosts.map((post) => (
          <Link
            href={`/post/${post.id}`}
            key={post.id}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>작성자: {post.author}</span>
              <span>작성일: {post.createdAt}</span>
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
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
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
