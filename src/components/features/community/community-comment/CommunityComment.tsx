'use client';
import Pagination from '@/components/common/Pagination';
import CommentForm from '@/components/features/community/community-comment/CommentForm';
import CommentListItem from '@/components/features/community/community-comment/CommentListItem';
import { Separator } from '@/components/ui/separator';
import { fetchReplies } from '@/data/functions/CommunityFetch';
import usePagination from '@/hooks/pageination.hook';
import { Comment, PostReply } from '@/types';
import { getUserImageUrl } from '@/utils';
import { CircleArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  commentList: PostReply[];
  post_id: string;
}
export default function CommunityComment({ commentList, post_id }: Props) {
  const [comments, setComments] = useState<PostReply[]>(commentList);
  const {
    currentPage,
    currentSection,
    viewList,
    viewPageList,
    totalSection,
    setCurrentPage,
    setCurrentSection,
    setTotalList,
  } = usePagination<PostReply>(5);

  useEffect(() => {
    setTotalList(comments);
  }, [comments, setTotalList]);

  // 댓글 다시 불러오는 함수
  const refreshComments = async () => {
    const res = await fetchReplies(Number(post_id));
    if (res.ok !== 1) return null;
    setComments(res.item); // 댓글 목록 상태 업데이트
  };

  return (
    <div className="flex flex-col pt-4">
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center gap-1.5 font-medium text-[#4A4A4A]">
          <span>댓글</span>
          <span className="font-semibold">{commentList.length}</span>
        </div>
        <div className="flex flex-col gap-4">
          {viewList.map(comment => (
            <CommentListItem key={comment._id} comment={comment} />
          ))}
        </div>
      </div>
      <div className="px-4 py-3">
        <Separator />
      </div>
      {/* 페이지네이션 */}
      <div className="flex w-full items-center justify-center">
        <Pagination
          currentPage={currentPage}
          currentSection={currentSection}
          setCurrentPage={setCurrentPage}
          setCurrentSection={setCurrentSection}
          viewPageList={viewPageList}
          totalSection={totalSection}
        />
      </div>
      {/* 댓글 입력창 */}
      <div className="p-4">
        <CommentForm _id={post_id} onSuccess={refreshComments} />
      </div>
    </div>
  );
}
