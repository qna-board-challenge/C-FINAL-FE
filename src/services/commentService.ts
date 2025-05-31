import api from '@/lib/api';

export interface Comment {
  id: number;
  nickname: string;
  content: string;
  created: string;
  updated: string;
}

export interface CreateCommentDto {
  nickname: string;
  password: string;
  content: string;
}

export interface UpdateCommentDto {
  nickname?: string;
  password: string;
  content?: string;
}

export const commentService = {
  // 댓글 목록 조회
  getComments: async (
    questionId: number,
    page: number = 0,
    size: number = 5
  ): Promise<{ content: Comment[]; totalElements: number }> => {
    const response = await api.get(
      `/v1/questions/comments/${questionId}?page=${page}&size=${size}`
    );
    return response.data;
  },

  // 댓글 작성
  createComment: async (
    questionId: number,
    comment: CreateCommentDto
  ): Promise<Comment> => {
    const response = await api.post(
      `/v1/questions/comments/${questionId}`,
      comment
    );
    return response.data;
  },

  // 댓글 수정
  updateComment: async (
    commentId: number,
    comment: UpdateCommentDto
  ): Promise<void> => {
    await api.put(`/v1/questions/comments/${commentId}`, comment);
  },

  // 댓글 삭제
  deleteComment: async (commentId: number, password: string): Promise<void> => {
    await api.delete(`/v1/questions/comments/${commentId}`, {
      data: { password },
    });
  },
};
