import { useState } from 'react';
import { Post } from '@/types';

interface CommunityPostContentProps {
  post: Post;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
}

export default function CommunityPostContent({
  post,
  isEditing,
  editContent,
  onEditContentChange,
  onEditSubmit,
  onEditCancel,
}: CommunityPostContentProps) {
  const [isExpandedText, setIsExpandedText] = useState(false);

  const handleTextToggle = () => {
    setIsExpandedText(!isExpandedText);
  };

  // 텍스트가 긴지 확인 ("더보기" 버튼까지 포함해서 한 줄)
  const isLongText = post.content.length > 40; // 더보기 버튼까지 한 줄에 들어가도록
  const displayText =
    isExpandedText || !isLongText
      ? post.content
      : `${post.content.slice(0, 40)}...`;

  if (isEditing) {
    return (
      <div className="min-h-12 px-5 py-3">
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={e => onEditContentChange(e.target.value)}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            placeholder="내용을 입력하세요..."
          />
          <div className="flex space-x-2">
            <button
              onClick={onEditSubmit}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              저장
            </button>
            <button
              onClick={onEditCancel}
              className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-12 px-5 py-3">
      <p className="text-sm leading-5 font-normal text-black">
        {displayText}
        {isLongText && (
          <button
            onClick={handleTextToggle}
            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {isExpandedText ? '접기' : '더보기'}
          </button>
        )}
      </p>
    </div>
  );
}
