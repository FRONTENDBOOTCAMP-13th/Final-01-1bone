import Image from 'next/image';
import { CircleArrowUp } from 'lucide-react';
import { getUserImageUrl } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { ApiRes } from '@/types'; 

interface CommentResponse {
  _id: number;
  content: string;
  createdAt: string;
  user: {
    _id: number;
    name: string;
    image?: string;
  };
}
interface CommentInputProps {
  postId: number;
  accessToken: string;
  createAction: (formData: FormData) => void;
  isCreating: boolean;
  createState: ApiRes<CommentResponse> | null;
}

export default function CommentInput({
  postId,
  accessToken,
  createAction,
  isCreating,
  createState,
}: CommentInputProps) {
  const { user } = useAuthStore(); 

  return (
    <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 bg-white">
      <form action={createAction} className="p-4">
        <input type="hidden" name="_id" value={postId} />
        <input type="hidden" name="accessToken" value={accessToken} />

        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="h-8 w-8 flex-shrink-0">
            <Image
              src={getUserImageUrl(user?.image)}
              alt="내 프로필"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>

          {/* 입력창 */}
          <div className="relative flex-1">
            <input
              type="text"
              name="content"
              placeholder="댓글을 입력하세요"
              className="h-10 w-full rounded-full border-none bg-gray-100 px-4 text-sm placeholder-gray-500 transition-colors outline-none focus:bg-gray-200"
              disabled={isCreating}
            />
          </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={isCreating}
            className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <CircleArrowUp size={24} className="text-black" />
          </button>
        </div>

        {/* 에러 메시지 */}
        {createState?.ok === 0 && (
          <p className="mt-2 text-sm text-red-500">
            {createState.errors?.content?.msg || createState.message}
          </p>
        )}
      </form>
    </div>
  );
}
