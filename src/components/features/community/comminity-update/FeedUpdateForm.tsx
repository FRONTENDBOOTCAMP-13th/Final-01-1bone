'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { createPost, updatePost } from '@/data/actions/post';
import { useAuthStore } from '@/store/auth.store';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useModalStore } from '@/store/modal.store';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { FEED_CATEGORIES } from '@/constant/category';
import { cn } from '@/lib/utils';
import { Post } from '@/types';
import { convertUrlsToFile } from '@/utils';

//          interface: 피드 수정 폼 입력 타입 정의          //
interface FormValues {
  attach: File[];
  content: string;
  tag: string;
  accessToken: string;
  type: string;
}

interface Props {
  post: Post;
}

export default function FeedUpdateForm({ post }: Props) {
  //          function: 오픈 모달 함수          //
  const openModal = useModalStore(state => state.openModal); // 성공 모달 열기용
  //          function: 라우터 함수          //
  const router = useRouter(); // 라우터 이동용

  console.log('게시물 본문', post.content);
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  //          state: 액세스토큰 상태          //
  const accessToken = useAuthStore(state => state.accessToken);
  //          state: react-hook-form(닉네임, 소개, 이미지, accessToken)          //
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      content: post.content ?? '',
      tag: post.tag ?? '',
      attach: [],
      accessToken: '',
      type: 'community',
    },
  });
  //          state: 피드 상태          //
  const [content, setContent] = useState<string>('');
  const [imageFileList, setImageFileList] = useState<File[]>([]);

  //          state: 본문 영역 요소 참조 상태          //
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const contentRegister = register('content');
  //          state: 이미지 입력 요소 참조 상태          //
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //          state: 피드 이미지 미리보기 URL 상태          //
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const onUploadButtonClickHandler = () => {
    console.log('업로드 버튼 클릭 됨');
  };

  //          event handler: 이미지 업로드 버튼 클릭 이벤트 처리          //
  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current || imageFileList.length >= 5) return;
    imageInputRef.current.click();
  };

  //          event handler: 이미지 변경 이벤트 처리          //
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      console.log('이렇게 큰 이미지를 넣는다고라?');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    const newImageFileList = imageFileList.map(item => item);
    newImageFileList.push(file);
    setImageFileList(newImageFileList);

    setValue('attach', newImageFileList);

    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  };

  //          event handler: 이미지 닫기 버튼 클릭 이벤트 처리          //
  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter(
      (url, index) => index !== deleteIndex,
    );
    setImageUrls(newImageUrls);

    const newImageFileList = imageFileList.filter(
      (file, index) => index !== deleteIndex,
    );
    setImageFileList(newImageFileList);
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

  //          event handler: 폼 제출 이벤트 처리          //
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('accessToken', data.accessToken);
      formData.append('content', data.content);
      formData.append('tag', data.tag);
      if (data.attach.length !== 0) {
        imageFileList.forEach(file => {
          formData.append('attach', file);
        });
      }
      const res = await updatePost(null, formData, post._id.toString());

      console.log('피드 수정 결과', res);

      if (res.ok === 1) {
        console.log('피드 수정 됨');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const watchedTag = watch('tag');

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, []);

  //          effect: 이미지 변경 시 실행할 함수          //
  useEffect(() => {
    const convertImagesToFiles = async () => {
      if (!post.image || post.image.length === 0) return;
      console.log('이미지 파일 뭐시기 저시기');
      const imageUrls = post.image as string[];
      const files = await convertUrlsToFile(imageUrls);
      setValue('attach', files);
      setImageFileList(files);
      setImageUrls(imageUrls);
    };

    convertImagesToFiles();
  }, [post.image, setValue]);

  //          effect: accessToken 변경 시 실행할 함수          //
  useEffect(() => {
    if (accessToken) {
      setValue('accessToken', accessToken);
    }
  }, [accessToken, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full min-h-[calc(100%-48px)] flex-1 flex-col"
    >
      {/* 숨겨진 필드들 */}
      <input type="hidden" name="type" value="community" />
      <input type="hidden" {...register('accessToken')} />
      <input type="hidden" {...register('tag')} />

      <div className="flex-1">
        <section className="flex flex-col gap-3">
          <p className="text-[#4A4A4A]">사진 등록</p>
          <Separator className="w-full" />
          <div className="flex">
            <div className="grid w-full grid-cols-3 gap-2">
              {imageUrls.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-full overflow-hidden rounded-md"
                >
                  <Image
                    src={imageUrl}
                    alt="게시물 이미지"
                    fill
                    className="object-cover object-center"
                  />
                  <div
                    className="p-0. absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center overflow-hidden rounded-full"
                    onClick={() => onImageCloseButtonClickHandler(index)}
                  >
                    <div className='h-full w-full bg-[url("/images/icon/close.png")] bg-contain bg-center' />
                  </div>
                </div>
              ))}
              <div
                className={cn(
                  'flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300',
                  imageFileList.length >= 5
                    ? 'cursor-default bg-gray-100'
                    : 'cursor-pointer',
                )}
                onClick={onImageUploadButtonClickHandler}
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChangeHandler}
                />
                {imageFileList.length >= 5 ? (
                  <X className="text-gray-300" />
                ) : (
                  <Plus className="text-gray-300" />
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col py-3 text-xs font-normal break-words whitespace-pre-wrap text-[#999999]">
            <p>이미지는 한장 이상 등록해야합니다</p>
            <p className="">
              욕설 비방 및 불법 촬영물에 관한 이미지를 게시하는 경우 법적,
              사적제재를 받을 수 있습니다
            </p>
          </div>
        </section>

        <section className="flex w-full flex-col gap-2 text-[#4A4A4A]">
          <p>내용</p>
          <Separator className="w-full" />
          <div className="w-full">
            <textarea
              {...register('content')}
              ref={el => {
                contentRegister.ref(el);
                contentRef.current = el;
              }}
              name="feed-content"
              id="feed-content"
              className="min-h-32 w-full resize-none outline-none"
              placeholder="본문"
              onChange={onContentChangeHandler}
            ></textarea>
          </div>
        </section>

        <section className="mb-8 flex w-full flex-col gap-2">
          <p className="font-medium text-[#4A4A4A]">태그</p>
          <Separator className="w-full" />
          <div className="flex w-full flex-wrap gap-2">
            {FEED_CATEGORIES.map(category => {
              const isSelected = watchedTag === category.value;

              return (
                <button
                  type="button"
                  key={category.value}
                  onClick={() => setValue('tag', category.value)}
                  className={cn(
                    'cursor-pointer appearance-none rounded-full border-2 border-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 select-none',
                    isSelected
                      ? 'border-[#98B87E] bg-[#CDD6A0] text-[#3B673A]'
                      : 'bg-white',
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
      {content && imageFileList.length !== 0 && watchedTag ? (
        <button
          type="submit"
          className="my-4 mb-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#4A4A4A] py-3 text-sm font-medium text-white"
          onClick={onUploadButtonClickHandler}
        >
          {'수정하기'}
        </button>
      ) : (
        <button
          type="button"
          className="cursor-not-allow my-4 flex w-full items-center justify-center rounded-full bg-black/40 py-3 text-sm font-medium text-white"
        >
          {'수정하기'}
        </button>
      )}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
        </div>
      )}
    </form>
  );
}
