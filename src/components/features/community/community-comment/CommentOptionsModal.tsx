interface CommentOptionsModalProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  type?: 'comment' | 'post';
}

export default function CommentOptionsModal({
  onClose,
  onEdit,
  onDelete,
  type = 'comment',
}: CommentOptionsModalProps) {
  const handleCancel = () => {
    onClose();
  };

  // 타입에 따라 텍스트 변경
  const deleteText = type === 'post' ? '게시글 삭제하기' : '댓글 삭제하기';
  const editText = type === 'post' ? '게시글 수정하기' : '댓글 수정하기';

  return (
    // z-index를 더 높게 설정 (댓글 바텀시트보다 위에)
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      {/* Dim 처리 */}
      {type !== 'comment' && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        />
      )}

      {/* 모달 내용 */}
      <div className="relative z-10 px-5 pb-8">
        {/* 상단 옵션 박스 (350x112) */}
        <div className="mb-[30px] flex h-[112px] w-[350px] flex-col rounded-lg bg-white">
          {/* 삭제하기 버튼 */}
          <button
            className="flex flex-1 items-center justify-center"
            onClick={onDelete}
          >
            <span className="text-lg font-semibold text-[#FE508B]">
              {deleteText}
            </span>
          </button>

          {/* 구분선 */}
          <div className="border-b border-[#EAEAEA]" />

          {/* 수정하기 버튼 */}
          <button
            className="flex flex-1 items-center justify-center"
            onClick={onEdit}
          >
            <span className="text-lg font-semibold text-black">{editText}</span>
          </button>
        </div>

        {/* 하단 취소 버튼 */}
        <button
          onClick={handleCancel}
          className="h-[56px] w-[350px] rounded-lg bg-white text-lg font-semibold text-black"
        >
          취소
        </button>
      </div>
    </div>
  );
}
