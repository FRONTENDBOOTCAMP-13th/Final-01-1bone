'use client';

import { useEffect, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { Post } from '@/types';
import CommentBottomSheet from '../community-comment/CommentBottomSheet';
import CommentOptionsModal from '../community-comment/CommentOptionsModal';
import CommunityPostHeader from './CommunityPostHeader';
import CommunityPostImage from './CommunityPostImage';
import CommunityPostActions from './CommunityPostActions';
import CommunityPostContent from './CommunityPostContent';
import { updatePost, deletePost } from '@/data/actions/post';
import { useAuthStore } from '@/store/auth.store';

// 카카오 SDK 타입 정의
interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      buttons: Array<{
        title: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      }>;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

interface CommunityMainProps {
  post: Post;
}

export default function CommunityMain({ post }: CommunityMainProps) {
  // 모달 상태
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);

  // 게시글 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  // 사용자 정보 및 권한
  const { user, accessToken } = useAuthStore();
  const isOwner = user?._id === post.user._id;

  // 서버 액션 상태 관리
  const [updateState, updateAction] = useActionState(updatePost, null);
  const [deleteState, deleteAction] = useActionState(deletePost, null);

  // 트랜지션 상태 관리
  const [isPending, startTransition] = useTransition();

  // 카카오 SDK 초기화
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '');
    }
  }, []);

  // 수정 성공/실패 처리
  useEffect(() => {
    if (updateState?.ok === 1) {
      alert('게시글이 수정되었습니다.');
    } else if (updateState?.ok === 0) {
      alert(updateState.message || '수정에 실패했습니다.');
    }
  }, [updateState]);

  // 삭제 성공/실패 처리
  useEffect(() => {
    if (deleteState?.ok === 1) {
      alert('게시글이 삭제되었습니다.');
      window.location.reload();
    } else if (deleteState?.ok === 0) {
      alert(deleteState.message || '삭제에 실패했습니다.');
    }
  }, [deleteState]);

  // 이벤트 핸들러들
  const handleComment = () => {
    setIsOpenComment(true);
  };

  const handleCommentClose = () => {
    setIsOpenComment(false);
  };

  const handlePostOptions = () => {
    setShowPostOptions(true);
  };

  const handleEditPost = () => {
    setIsEditing(true);
    setShowPostOptions(false);
  };

  const handleEditSubmit = () => {
    const formData = new FormData();
    formData.append('_id', post._id.toString());
    formData.append('content', editContent);
    formData.append('accessToken', accessToken || '');

    startTransition(() => {
      updateAction(formData);
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(post.content || '');
  };

  const handleDeletePost = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const formData = new FormData();
      formData.append('_id', post._id.toString());
      formData.append('accessToken', accessToken || '');

      startTransition(() => {
        deleteAction(formData);
      });
    }
    setShowPostOptions(false);
  };

  const handleShareToKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${post.user.name}의 게시물`,
        description: post.content,
        imageUrl: `https://fesp-api.koyeb.app/market/${post.image?.[0]}`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  return (
    <>
      {/* <div className="h-14"></div> */}
      <div className="w-full pl-5">
        {/* 상단 프로필 영역 */}
        <CommunityPostHeader
          post={post}
          isOwner={isOwner}
          onOptionsClick={handlePostOptions}
        />

        {/* 하단 텍스트 영역 */}
        <CommunityPostContent
          post={post}
          isEditing={isEditing}
          editContent={editContent}
          onEditContentChange={setEditContent}
          onEditSubmit={handleEditSubmit}
          onEditCancel={handleEditCancel}
        />
        {/* 중간 - 피드 이미지 */}
        <CommunityPostImage post={post} />

        {/* 아이콘 영역 (댓글, 공유, 북마크) */}
        <CommunityPostActions
          postId={post._id.toString()}
          onCommentClick={handleComment}
          onShareClick={handleShareToKakao}
        />

        {/* 하단 보더라인 */}
        <div className="border-b border-[#EAEAEA]"></div>
      </div>

      {/* 댓글 모달 */}
      {isOpenComment && (
        <CommentBottomSheet
          isOpen={isOpenComment}
          onClose={handleCommentClose}
          postId={post._id}
        />
      )}

      {/* 게시글 옵션 모달 */}
      {showPostOptions && (
        <CommentOptionsModal
          type="post"
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onClose={() => setShowPostOptions(false)}
        />
      )}
    </>
  );
}
