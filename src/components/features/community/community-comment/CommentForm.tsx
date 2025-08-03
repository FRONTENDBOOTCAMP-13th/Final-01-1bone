'use client';

import { createReply } from '@/data/actions/post';
import { fetchReplies } from '@/data/functions/CommunityFetch';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

//          interface:  댓글 폼 입력 타입 정의          //
interface FormValues {
  _id: string;
  accessToken: string;
  content: string;
}

interface Props {
  _id: string;
  onSuccess?: () => void;
}

export default function CommentForm({ _id, onSuccess }: Props) {
  //          state: 액세스토큰 상태          //
  const accessToken = useAuthStore(state => state.accessToken);

  //          state: react-hook-form(닉네임, 소개, 이미지, accessToken)          //
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      _id: '',
      accessToken: '',
      content: '',
    },
  });
  //          state: 피드 상태          //
  const [content, setContent] = useState<string>('');
  //          state: 댓글 영역 요소 참조 상태          //
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const contentRegister = register('content');

  //          event handler: 폼 제출 이벤트 처리          //
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('_id', _id);
    formData.append('accessToken', data.accessToken);
    formData.append('content', data.content);

    const res = await createReply(null, formData);

    if (res.ok === 1) {
      setContent('');
      setValue('content', '');
      onSuccess?.();
    }
  };

  //          event handler: 내용 변경 이벤트 처리          //
  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setContent(value);
    setValue('content', value);

    if (!contentRef.current) return;

    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  };

  //          effect: accessToken 변경 시 실행할 함수          //
  useEffect(() => {
    if (accessToken) {
      setValue('accessToken', accessToken);
    }
  }, [accessToken, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm border border-gray-300 p-3"
    >
      <div className="flex flex-col">
        <textarea
          {...register('content')}
          value={content}
          placeholder="댓글을 작성해주세요"
          className="min-h-12 w-full resize-none outline-none"
          ref={el => {
            contentRegister.ref(el); // react-hook-form용
            contentRef.current = el; // textarea 동적 높이 조절용
          }}
          onChange={onContentChangeHandler}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          disabled={!content.trim()}
          className={cn(
            'flex items-center justify-center rounded-full px-3 py-2 text-sm leading-none text-white',
            content.trim() ? 'cursor-pointer bg-[#98B87E]' : 'bg-gray-300',
          )}
        >
          댓글달기
        </button>
      </div>
    </form>
  );
}
