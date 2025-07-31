import { MessageCircle, SquareArrowOutUpRight, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import {
  postBookmark,
  deleteBookmark,
  getBookmark,
} from '@/data/actions/bookmark';
import { Bookmark as BookmarkType } from '@/types/bookmark';

interface CommunityPostActionsProps {
  postId: string;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export default function CommunityPostActions({
  postId,
  onCommentClick,
  onShareClick,
}: CommunityPostActionsProps) {
  const { user, accessToken } = useAuthStore();
  const [isCheckBookmark, setIsCheckBookmark] = useState(false);
  const [bookmarkData, setBookmarkData] = useState<BookmarkType | null>(null);

  // 초기 북마크 상태 확인
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!accessToken) return;

      try {
        const response = await getBookmark('post', Number(postId), accessToken);
        if (response.ok === 1) {
          setIsCheckBookmark(true);
          setBookmarkData(response.item);
        }
      } catch (error) {
        console.error('북마크 상태 확인 실패:', error);
      }
    };

    checkBookmarkStatus();
  }, [postId, accessToken]);

  const handleCheckBookmark = async () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const newBookmarkStatus = !isCheckBookmark;
    setIsCheckBookmark(newBookmarkStatus);

    try {
      if (newBookmarkStatus) {
        // 북마크 추가
        const response = await postBookmark(
          'post',
          Number(postId),
          accessToken,
        );
        if (response.ok === 1) {
          setBookmarkData(response.item);
        } else {
          setIsCheckBookmark(false);
          alert(
            response.ok === 0
              ? response.message
              : '북마크 추가에 실패했습니다.',
          );
        }
      } else {
        // 북마크 삭제
        if (bookmarkData?._id) {
          const response = await deleteBookmark(bookmarkData._id, accessToken);
          if (response.ok === 1) {
            setBookmarkData(null);
          } else {
            setIsCheckBookmark(true);
            alert(
              response.ok === 0
                ? response.message
                : '북마크 삭제에 실패했습니다.',
            );
          }
        }
      }
    } catch (error) {
      setIsCheckBookmark(!newBookmarkStatus);
      alert('북마크 처리에 실패했습니다.');
    }
  };

  return (
    <div className="flex h-12 items-center justify-between px-5">
      {/* 좌측 댓글,공유 아이콘 */}
      <div className="flex items-center gap-[14px]">
        <button className="cursor-pointer" onClick={onCommentClick}>
          <MessageCircle size={24} className="text-black" />
        </button>
        <button className="cursor-pointer" onClick={onShareClick}>
          <SquareArrowOutUpRight size={24} className="text-black" />
        </button>
      </div>

      {/* 우측 북마크 아이콘 */}
      <button className="cursor-pointer" onClick={handleCheckBookmark}>
        {isCheckBookmark ? (
          <Bookmark size={24} className="fill-black text-black" />
        ) : (
          <Bookmark size={24} className="text-black" />
        )}
      </button>
    </div>
  );
}
