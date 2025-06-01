// app/posts/[id]/page.tsx

import PostDetail from './PostDetail';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:8080/v1/questions?size=10');
    if (!res.ok) throw new Error('서버 응답 실패');

    const json = await res.json();
    const posts = json.content;

    return posts.map((post: { id: number }) => ({
      id: post.id.toString(),
    }));
  } catch (err) {
    console.error('🚨 generateStaticParams 에러:', err);
    return [];
  }
}

// ✅ 안전하게 props를 받아 사용하는 방식
export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id;

  console.log('받아온 id:', id); // 디버깅용 로그

  return <PostDetail />;
}
