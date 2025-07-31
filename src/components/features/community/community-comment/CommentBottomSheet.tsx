'use client';

import { useEffect, useRef, useState, useTransition, useCallback } from 'react';
import { useActionState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/auth.store';
import { fetchReplies } from '@/data/functions/CommunityFetch';
import { createReply, updateReply, deleteReply } from '@/data/actions/post';
import { ApiRes } from '@/types';
import CommentHeader from './CommentHeader';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import CommentOptionsModal from './CommentOptionsModal';

interface CommentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

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

export default function CommentBottomSheet({
  isOpen,
  onClose,
  postId,
}: CommentBottomSheetProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 관련 상태
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // 사용자 정보
  const { data: session } = useSession();
  const { user } = useAuthStore();

  // 트랜지션 상태 관리
  const [isPending, startTransition] = useTransition();

  // 서버 액션들
  const [createState, createAction, isCreating] = useActionState(
    createReply,
    null,
  );
  const [updateState, updateAction, isUpdating] = useActionState(
    updateReply,
    null,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteReply,
    null,
  );

  // 이전 상태 추적 (중복 방지용) - 타입 수정
  const [prevUpdateState, setPrevUpdateState] =
    useState<ApiRes<Comment> | null>(null);
  const [prevDeleteState, setPrevDeleteState] = useState<ApiRes<null> | null>(
    null,
  );

  // 댓글 목록 불러오기 - useCallback으로 메모이제이션
  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchReplies(postId);
      if (res.ok) {
        setComments(res.item);
      }
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 댓글 등록 성공 시 새로고침
  useEffect(() => {
    if (createState?.ok) {
      loadComments();
    }
  }, [createState, loadComments]);

  // 댓글 수정 성공 시 처리 (중복 방지)
  useEffect(() => {
    if (updateState !== prevUpdateState) {
      if (updateState?.ok === 1) {
        alert('댓글이 수정되었습니다.');
        setEditingCommentId(null);
        setEditContent('');
        loadComments();
      } else if (updateState?.ok === 0) {
        alert(updateState.message || '댓글 수정에 실패했습니다.');
      }
      setPrevUpdateState(updateState);
    }
  }, [updateState, prevUpdateState, loadComments]);

  // 댓글 삭제 성공 시 처리 (중복 방지)
  useEffect(() => {
    if (deleteState !== prevDeleteState) {
      if (deleteState?.ok === 1) {
        alert('댓글이 삭제되었습니다.');
        loadComments();
      } else if (deleteState?.ok === 0) {
        alert(deleteState.message || '댓글 삭제에 실패했습니다.');
      }
      setPrevDeleteState(deleteState);
    }
  }, [deleteState, prevDeleteState, loadComments]);

  // 모달 열릴 때 댓글 로드
  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, loadComments]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 배경 클릭시 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 댓글 옵션 메뉴 열기 (본인 댓글만)
  const handleCommentOptions = (comment: Comment) => {
    if (user?._id === comment.user._id) {
      setSelectedCommentId(comment._id);
      setShowOptionsModal(true);
    }
  };

  // 댓글 수정 시작
  const handleEditComment = () => {
    const comment = comments.find(c => c._id === selectedCommentId);
    if (comment) {
      setEditingCommentId(comment._id);
      setEditContent(comment.content);
    }
    setShowOptionsModal(false);
  };

  // 댓글 수정 저장
  const handleSaveEdit = () => {
    const { accessToken } = useAuthStore.getState();

    const formData = new FormData();
    formData.append('_id', postId.toString());
    formData.append('replyId', editingCommentId!.toString());
    formData.append('content', editContent);
    formData.append('accessToken', accessToken || '');

    startTransition(() => {
      updateAction(formData);
    });
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // 댓글 삭제
  const handleDeleteComment = () => {
    if (confirm('정말 댓글을 삭제하시겠습니까?')) {
      const { accessToken } = useAuthStore.getState();

      const formData = new FormData();
      formData.append('_id', postId.toString());
      formData.append('replyId', selectedCommentId!.toString());
      formData.append('accessToken', accessToken || '');

      startTransition(() => {
        deleteAction(formData);
      });
    }
    setShowOptionsModal(false);
  };

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* z-index를 더 높게 설정 (탭바보다 위에) */}
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        {/* 배경 오버레이 - 50% 투명도로 변경 */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-500"
          onClick={handleBackdropClick}
        />

        {/* 바텀시트 컨테이너 - 모바일 크기로 제한하되 그 안에서 전체 너비 */}
        <div
          ref={modalRef}
          className="relative w-full max-w-[600px] transform rounded-t-[20px] bg-white shadow-xl transition-transform duration-600 ease-out"
          style={{
            height: '50vh', // 화면 절반 높이
            animation: isOpen
              ? 'slideUp 0.5s ease-out'
              : 'slideDown 0.5s ease-in',
          }}
        >
          {/* 상단 헤더 */}
          <CommentHeader onClose={onClose} />

          {/* 댓글 목록 영역 */}
          <CommentList
            comments={comments}
            loading={loading}
            currentUserId={user?._id}
            editingCommentId={editingCommentId}
            editContent={editContent}
            isUpdating={isUpdating}
            onEditContentChange={setEditContent}
            onEditSave={handleSaveEdit}
            onEditCancel={handleCancelEdit}
            onCommentOptions={handleCommentOptions}
            formatTime={formatTime}
          />

          {/* 하단 고정 댓글 입력창 */}
          <CommentInput
            postId={postId}
            accessToken={session?.accessToken || 'test-token'}
            createAction={createAction}
            isCreating={isCreating}
            createState={createState}
          />
        </div>

        {/* 애니메이션 CSS */}
        <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          @keyframes slideDown {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(100%);
            }
          }
        `}</style>
      </div>

      {/* 댓글 옵션 모달 */}
      {showOptionsModal && (
        <CommentOptionsModal
          type="comment"
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
          onClose={() => setShowOptionsModal(false)}
        />
      )}
    </>
  );
}
