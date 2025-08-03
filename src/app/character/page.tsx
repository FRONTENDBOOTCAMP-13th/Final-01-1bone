import ChracterPageClient from '@/components/features/character/CharacterPage';
import ItemSection from '@/components/features/character/ItemSection';
import { getUserAttribute } from '@/data/actions/user';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function ChracterPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error('로그인이 필요합니다');
  }

  const res = await getUserAttribute(session?.user._id, 'extra');

  if (res.ok !== 1) return null;

  return (
    <main className="relative flex h-[calc(100dvh-56px)] min-h-[calc(100%-56px)] flex-col overflow-hidden bg-[url('/images/etc/character-bg.webp')] bg-cover bg-center pt-12">
      <ChracterPageClient extra={res.item.extra} />
      <ItemSection extra={res.item.extra} />
    </main>
  );
}
