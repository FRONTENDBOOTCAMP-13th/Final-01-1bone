import { getPostDetail } from '@/data/actions/post';
import { getUserImageUrl } from '@/utils';
import Image from 'next/image';

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  const res = await getPostDetail(postId);

  if (res.ok !== 1) return null;

  const notice = res.item;

  return (
    <main className="mb-10 flex w-full">
      <div className="flex w-full flex-col items-center px-4">
        <div className="flex w-full flex-col border-b border-[#4D4D4D]">
          {/* 헤더영역 */}
          <div className="flex items-center gap-3 border-b border-[#D9D9D9] py-6">
            <div className="flex flex-1 flex-col justify-start gap-3">
              <h2 className="truncate font-semibold break-words text-[#1A1A1A]">
                {notice.title}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Image
                  src={getUserImageUrl(notice.user.image)}
                  alt="유저 이미지"
                  width={24}
                  height={24}
                  priority
                  className="rounded-full"
                />
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-sm break-words whitespace-pre-wrap text-[#1A1A1A]">
                    {notice.user.name}
                  </span>
                  <span className="text-xs break-words whitespace-pre-wrap text-[#666666]">
                    {notice.updatedAt.slice(0, 10)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 본문 영역 */}
          <div className="flex flex-col gap-3 py-8 whitespace-pre-wrap text-[#4D4D4D]">
            {notice.image && (
              <Image
                src={getUserImageUrl(notice.image)}
                alt="공지사항 이미지"
                width={600}
                height={600}
              />
            )}
            <div>{notice.content}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
