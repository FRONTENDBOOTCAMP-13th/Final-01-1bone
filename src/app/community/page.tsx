import CommunityFeed from '@/components/features/community/community-main/CommunityFeed';
import CommunityMain from '@/components/features/community/community-main/CommunityMain';
import { fetchPosts } from '@/data/functions/CommunityFetch';
import { Post } from '@/types/';

export default async function CommunityPage() {
  const res = await fetchPosts('community');

  if (res.ok !== 1) return null;

  console.log('피드 전체목록', res.item);
  return (
    <main className="flex w-full flex-1 flex-col bg-white">
      {/* 메인 컨텐츠 */}
      <div className="mx-5">
        여기에 뭐라도 있어야겠는데? 있을거면 컬러도 있어야겠는데? 검색?
        카테고리로 필터링? 커뮤니티 준수 규칙? 팔로우 버튼만 있어도 색상좀 채울
        수 있는데... 태그도 만들고 무한스크롤에 상세페이지 페이지네이션에 게시글
        수정에 게시글 삭제에 상세 페이지 이동 방식도 수정해야하고 더보기 넣을 까
        말까 할래말래 차라리 다크모드 였다면 더 예뻤을 듯 위로 올라가는 버튼
        뭐라하지 암튼 플로팅 버튼도 있어야하네? 북마크도 해야하잖아? 공유에서
        이미지 안올라가는것도 해결해야하고
      </div>
      {res.item.map((post: Post) => (
        <CommunityFeed key={post._id} post={post} page="main" />
      ))}
    </main>
  );
}
