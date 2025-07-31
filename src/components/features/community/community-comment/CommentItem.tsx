import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { getUserImageUrl } from '@/utils'; 

interface Comment {
  _id: number;
  content: string;
  createdAt: string;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  isEditing: boolean;
  editContent: string;
  isUpdating: boolean;
  onEditContentChange: (content: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onOptionsClick: () => void;
  formatTime: (dateString: string) => string;
}

export default function CommentItem({
  comment,
  currentUserId,
  isEditing,
  editContent,
  isUpdating,
  onEditContentChange,
  onEditSave,
  onEditCancel,
  onOptionsClick,
  formatTime,
}: CommentItemProps) {
  const isOwner = currentUserId === comment.user._id;

  return (
    <div className="flex items-start gap-3 py-3">
      {/* 프로필 이미지 */}
      <div className="h-8 w-8 flex-shrink-0">
        <Image
          src={getUserImageUrl(comment.user.image)}
          alt={`${comment.user.name} 프로필`}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </div>

      {/* 댓글 내용 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-black">
            {comment.user.name}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(comment.createdAt)}
          </span>
        </div>

        {/* 수정 모드일 때 입력창, 아닐 때 텍스트 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={e => onEditContentChange(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={2}
              placeholder="댓글을 입력하세요..."
            />
            <div className="flex space-x-2">
              <button
                onClick={onEditSave}
                disabled={isUpdating}
                className="rounded-lg bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-50"
              >
                저장
              </button>
              <button
                onClick={onEditCancel}
                className="rounded-lg bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-gray-800">
            {comment.content}
          </p>
        )}
      </div>

      {/* 세로점 3개 메뉴 (본인 댓글만 표시) */}
      {isOwner && (
        <button
          onClick={onOptionsClick}
          className="flex-shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}
