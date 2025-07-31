import CommunityMain from '@/components/features/community/community-main/CommunityMain';
import { fetchPosts } from '@/data/functions/CommunityFetch';
import { Post } from '@/types/';

export default async function CommunityPage() {
  const res = await fetchPosts('community');

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* 상단 헤더 - 고정 */}
      {/* <CommunityMainHeader /> */}

      {/* 메인 컨텐츠 */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {/* 피드 아이템들 */}
        {res.ok ? (
          res.item.map((post: Post) => {
            console.log('post._id:', post._id);
            return <CommunityMain key={post._id} post={post} />;
          })
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500">{res.message}</p>
          </div>
        )}
      </div>

      {/* 하단 탭바 - 고정 */}
      {/* <TabBar /> */}
    </div>
  );
}
