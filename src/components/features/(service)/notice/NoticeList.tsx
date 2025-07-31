'use client';

import Pagination from '@/components/common/Pagination';
import { Separator } from '@/components/ui/separator';
import usePagination from '@/hooks/pageination.hook';
import { Post } from '@/types';
import Link from 'next/link';
import { useEffect } from 'react';

//          interface: NoticeList compoent properties          //
interface Props {
  notices: Post[];
}

//          component: NoticeList component          //
export default function NoticeList({ notices }: Props) {
  //          state: 페이지네이션 관련 상태          //
  const {
    currentPage,
    currentSection,
    viewList,
    viewPageList,
    totalSection,
    setCurrentPage,
    setCurrentSection,
    setTotalList,
  } = usePagination<Post>(10);

  useEffect(() => {
    setTotalList(notices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="min-h-[770px] w-full">
        <ul>
          {viewList &&
            viewList.map(notice => (
              <div key={notice._id}>
                <li className="py-4.5" key={notice._id}>
                  <Link
                    href={`notice/${notice._id}`}
                    className="flex flex-col gap-1"
                  >
                    <div className="truncate text-sm font-medium break-words">
                      <span className="text-[#4D4D4D]">{`[공지] ${notice.title}`}</span>
                    </div>
                    <span className="text-xs text-[#666666]">
                      {notice.updatedAt.slice(0, 10)}
                    </span>
                  </Link>
                </li>
                <Separator color="#f2f2f2" />
              </div>
            ))}
        </ul>
      </div>
      <div className="my-5">
        <Pagination
          currentPage={currentPage}
          currentSection={currentSection}
          setCurrentPage={setCurrentPage}
          setCurrentSection={setCurrentSection}
          viewPageList={viewPageList}
          totalSection={totalSection}
        />
      </div>
    </>
  );
}
