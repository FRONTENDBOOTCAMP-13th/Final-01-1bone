import { Megaphone } from 'lucide-react';
import NoticeList from '@/components/features/(service)/notice/NoticeList';
import { getPosts } from '@/data/actions/post';

export default async function NoticePage() {
  const res = await getPosts('notice');

  if (res.ok !== 1) return null;
  const notices = res.item;
  return (
    <main className="flex flex-col items-center px-4">
      <div className="mt-5 flex items-center justify-center gap-1 self-start rounded-full border border-[#4A4A4A] bg-[#4A4A4A] px-3 py-0.5 text-white">
        <Megaphone size={12} />
        <span className="text-xs">공지</span>
      </div>
      <NoticeList notices={notices} />
    </main>
  );
}
