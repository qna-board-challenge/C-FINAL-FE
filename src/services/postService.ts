import api from '@/lib/api';
// api 객체를 사용하여 API 요청을 처리합니다.
export interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
}

export interface PostCreateRequest {
  title: string;
  author: string;
  password: string;
  content: string;
}

export interface PostUpdateRequest extends PostCreateRequest {
  id: number;
}

export interface PostListResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  password: string;
}

export interface CommentCreateRequest {
  content: string;
  author: string;
  password: string;
}

// 게시글 목록 조회
export const getPosts = async (
  page: number = 0,
  size: number = 10,
  sort: string = 'createdAt,desc'
) => {
  const response = await api.get<PostListResponse>('/posts', {
    params: { page, size, sort },
  });
  return response.data;
};

// 게시글 검색
export const searchPosts = async (
  keyword: string,
  page: number = 0,
  size: number = 10
) => {
  const response = await api.get<PostListResponse>('/posts/search', {
    params: { keyword, page, size },
  });
  return response.data;
};

// 게시글 상세 조회
export const getPost = async (id: number) => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

// 게시글 작성
export const createPost = async (post: PostCreateRequest) => {
  const response = await api.post<Post>('/posts', post);
  return response.data;
};

// 게시글 수정
export const updatePost = async (post: PostUpdateRequest) => {
  const response = await api.put<Post>(`/posts/${post.id}`, post);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (id: number, password: string) => {
  await api.delete(`/posts/${id}`, {
    data: { password },
  });
};

// 댓글 목록 조회
export const getComments = async (postId: number) => {
  const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
  return response.data;
};

// 댓글 작성
export const createComment = async (
  postId: number,
  comment: CommentCreateRequest
) => {
  const response = await api.post<Comment>(
    `/posts/${postId}/comments`,
    comment
  );
  return response.data;
};

// 댓글 수정
export const updateComment = async (
  postId: number,
  commentId: number,
  comment: CommentCreateRequest
) => {
  const response = await api.put<Comment>(
    `/posts/${postId}/comments/${commentId}`,
    comment
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (
  postId: number,
  commentId: number,
  password: string
) => {
  await api.delete(`/posts/${postId}/comments/${commentId}`, {
    data: { password },
  });
};
