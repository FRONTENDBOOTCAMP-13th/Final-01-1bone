import { getOtherUserInfo, getUserInfo } from '@/data/actions/user';
import { UserPageClient } from '@/components/features/user/UserPage';
import { getUserPosts } from '@/data/actions/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBookmarks } from '@/data/actions/bookmark';

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error('로그인이 필요합니다');
  }

  if (!session.accessToken) return null;

  const { id } = await params;
  const userId = Number(id);
  const res = await getUserInfo(userId);

  if (!res.ok || !res.item) return null;
  const user = res.item;

  const postRes = await getUserPosts(userId, 'community');
  const posts = postRes.ok ? postRes.item : [];

  const bookmarkRes = await getBookmarks('user', session.accessToken);

  if (bookmarkRes.ok !== 1 || !res.item) return null;
  const userBookmark = bookmarkRes.item;

  console.log(userBookmark);

  // const recommendedRes = await getOtherUserInfo(userId);

  // if (!recommendedRes.ok || !recommendedRes.item) return null;
  // const recommendedUser = recommendedRes.item;

  return (
    <UserPageClient
      user={user}
      posts={posts}
      userBookmark={userBookmark}
      // recommenedUser={recommendedUser}
    />
  );
}
