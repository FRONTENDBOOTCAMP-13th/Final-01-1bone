import CommentItem from './CommentItem';

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

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  currentUserId?: number;
  editingCommentId: number | null;
  editContent: string;
  isUpdating: boolean;
  onEditContentChange: (content: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onCommentOptions: (comment: Comment) => void;
  formatTime: (dateString: string) => string;
}

export default function CommentList({
  comments,
  loading,
  currentUserId,
  editingCommentId,
  editContent,
  isUpdating,
  onEditContentChange,
  onEditSave,
  onEditCancel,
  onCommentOptions,
  formatTime,
}: CommentListProps) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex h-32 items-center justify-center">
          <div className="text-gray-500">댓글을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex h-32 items-center justify-center">
          <div className="text-gray-500">아직 댓글이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="px-4 py-2">
        {comments.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            isEditing={editingCommentId === comment._id}
            editContent={editContent}
            isUpdating={isUpdating}
            onEditContentChange={onEditContentChange}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onOptionsClick={() => onCommentOptions(comment)}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
}
