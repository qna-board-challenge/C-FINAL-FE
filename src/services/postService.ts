import api from '@/lib/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  nickname: string;
  password: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  password: string;
}

export const postService = {
  // 게시글 목록 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get('/v1/questions');
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/v1/questions/${id}`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (post: CreatePostDto): Promise<Post> => {
    const response = await api.post('/v1/questions', post);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (id: number, post: UpdatePostDto): Promise<Post> => {
    const response = await api.put(`/v1/questions/${id}`, post);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/v1/questions/${id}`);
  },
};
