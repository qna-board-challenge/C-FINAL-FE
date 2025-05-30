'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getPosts,
  searchPosts,
  Post,
  //PostListResponse,
} from '@/services/postService';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'comments'>('latest');
  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sort = sortBy === 'latest' ? 'createdAt,desc' : 'commentCount,desc';
      const response = await getPosts(currentPage, postsPerPage, sort);
      setPosts(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPosts();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await searchPosts(searchTerm, currentPage, postsPerPage);
      setPosts(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('검색에 실패했습니다.');
      console.error('Error searching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, sortBy]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                href={`/post/${post.id}`}
                key={post.id}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>작성자: {post.author}</span>
                  <span>
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span>댓글: {post.commentCount}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
