import { getUserInfo } from '@/data/actions/user';
import { UserEditForm } from '@/components/features/user/UserEditForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function UserEditPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error('로그인이 필요합니다');
  }

  const res = await getUserInfo(session.user._id);

  if (res.ok !== 1) return null;

  const user = res.item;

  if (!user) return null;

  return (
    <div className="flex h-[calc(100%-48px)] flex-col">
      <UserEditForm user={user} />
    </div>
  );
}
