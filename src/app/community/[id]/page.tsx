import { getPost } from '@/data/actions/post';
import CommunityMain from '@/components/features/community/community-main/CommunityMain';

interface CommunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);

  // 게시글 데이터 조회
  const res = await getPost(postId);

  if (!res.ok || !res.item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            게시글를 찾을 수 없습니다
          </h2>
          <p className="mb-4 text-gray-600">
            요청하신 게시글이 존재하지 않거나, 이동 또는 삭제되었습니다.
          </p>
          <button
            onClick={() => window.history.back()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            이전으로
          </button>
        </div>
      </div>
    );
  }

  // CommunityMain 컴포넌트 재사용
  return (
    <div className="min-h-screen bg-white">
      <CommunityMain post={res.item} />
    </div>
  );
}
