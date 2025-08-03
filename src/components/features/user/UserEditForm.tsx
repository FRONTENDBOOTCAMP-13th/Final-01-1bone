'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { updateUserInfo } from '@/data/actions/user';
import { User } from '@/types/';
import { useEffect, useRef, useState } from 'react';
import { converUrlToFile, getUserImageUrl } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modal.store';
import SuccessModal from '@/components/features/user/edit/SuccessModal';

//          interface: 프로필 수정 폼 컴포넌트 Properties          //
interface Props {
  user: User;
}

//          interface: 프로필 수정 폼 입력 타입 정의          //
interface FormValues {
  phone: string;
  nickname: string;
  introduction: string;
  attach: File | null;
  accessToken: string;
}

//          component: 프로필 수정 폼 컴포넌트          //
export function UserEditForm({ user }: Props) {
  //          state: 프로필 이미지 업로드 요소 참조 상태          //
  const fileInputRef = useRef<HTMLInputElement>(null);
  //          state: 액세스토큰 상태          //
  const accessToken = useAuthStore(state => state.accessToken); // Zustand에서 accessToken 가져옴
  //          state: 프로필 이미지 미리보기 상태          //
  const [preview, setPreview] = useState<string>(
    '/images/default-profile-image.webp',
  ); // 프로필 이미지 미리보기

  //          state: react-hook-form(닉네임, 소개, 이미지, accessToken)          //
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      phone: user.phone ?? '01000000000',
      nickname: user.extra?.nickname ?? '',
      introduction: user.extra?.introduction ?? '',
      attach: null,
      accessToken: '',
    },
  });

  //          function: 라우터 함수          //
  const router = useRouter(); // 라우터 이동용
  //          function: 오픈 모달 함수          //
  const openModal = useModalStore(state => state.openModal); // 성공 모달 열기용

  const [phoneLength, setPhoneLength] = useState<number>(
    user.phone?.length ?? 0,
  );
  const [nicknameLength, setNicknameLength] = useState<number>(
    user.extra?.nickname?.length ?? 0,
  );
  const [introLength, setIntroLength] = useState<number>(
    user.extra?.introduction?.length ?? 0,
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 11) {
      // 11자 이하로 제한
      setPhoneLength(e.target.value.length);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 15) {
      setNicknameLength(e.target.value.length);
    }
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 30) {
      setIntroLength(e.target.value.length);
    }
  };

  //          event handler: 폼 제출 이벤트 처리          //
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('phone', data.phone);
    formData.append('nickname', data.nickname);
    formData.append('introduction', data.introduction);
    formData.append('accessToken', data.accessToken);
    if (data.attach) {
      formData.append('attach', data.attach);
    }
    const res = await updateUserInfo(user._id, formData);

    if (res.ok === 1) {
      openModal(({ onClose }) => (
        <SuccessModal key="success-modal" onClose={onClose} />
      ));

      router.push(`/user/${user._id}`);
    }
  };

  //          event handler: 이미지 박스 선택 이벤트 처리          //
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  //          event handler: 프로필 이미지 변경 이벤트 처리          //
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue('attach', file);
    }
  };

  //          effect: 이미지 변경 시 실행할 함수          //
  useEffect(() => {
    const convertImageToFile = async () => {
      const preview = getUserImageUrl(user.image);
      if (!preview) return;
      setPreview(preview);
      const file = await converUrlToFile(preview);
      setValue('attach', file);
    };

    convertImageToFile();
  }, [user.image, setValue]);

  //          effect: accessToken 변경 시 실행할 함수          //
  useEffect(() => {
    if (accessToken) {
      setValue('accessToken', accessToken);
    }
  }, [accessToken, setValue]);

  //          render: 프로필 수정 컴포넌트 렌더링          //
  return (
    <section className="relative flex flex-1 flex-col justify-center pt-10">
      {/* 프로필 이미지 영역 */}
      <div className="relative mx-auto mb-6 flex w-[100px] items-center justify-center">
        <Image
          src={preview}
          alt="프로필 이미지"
          width={100}
          height={100}
          className="size-[100px] rounded-full object-cover"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        {/* 이미지 변경 버튼 (카메라 아이콘) */}
        <div
          onClick={handleImageClick}
          className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border bg-white"
        >
          <ImageIcon size={16} />
        </div>
      </div>

      {/* 유저 정보 수정 폼 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-1 flex-col justify-between gap-5 px-5"
      >
        <input type="hidden" {...register('accessToken')} />

        <div className="flex h-full flex-col gap-6">
          {/* 닉네임 입력 */}
          <section className="flex w-full flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-bold break-words whitespace-pre-wrap text-[#1A1A1A]">
                닉네임
              </span>
              <span className="text-sm text-[#666666]">
                한글, 영문, 숫자만 가능(최대 15자)
              </span>
            </div>
            <p className="text-sm text-[#666666]">
              닉네임은 아바타이름으로 사용됩니다
            </p>
            <input
              {...register('nickname')}
              maxLength={15}
              onChange={handleNicknameChange}
              placeholder="닉네임 (최대 15자)"
              className="h-12 w-full rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#1A1A1A] outline-none focus:border-black"
            />
            <div className="flex justify-end">
              <span className="text=[#666666] text-xs">{`${nicknameLength}/15`}</span>
            </div>
          </section>

          {/* 소개 입력 */}
          <section className="mt-4 flex w-full flex-col gap-2">
            <p className="font-bold break-words whitespace-pre-wrap text-[#1A1A1A]">
              내 소개
            </p>
            <textarea
              {...register('introduction')}
              maxLength={30}
              placeholder="내 소개 (최대 30자)"
              onChange={handleIntroChange}
              className="min-h-52 w-full rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#1A1A1A] outline-none focus:border-black"
            />
            <div className="flex justify-end">
              <span className="text-xs text-[#666666]">{`${introLength}/30`}</span>
            </div>
          </section>
          {/* 전화번호 입력 */}
          <section className="flex w-full flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-bold break-words whitespace-pre-wrap text-[#1A1A1A]">
                전화번호
              </span>
              <span className="text-sm text-[#666666]">
                010으로 시작하는 11자리 숫자
              </span>
            </div>

            <input
              {...register('phone')}
              maxLength={11}
              onChange={handlePhoneChange}
              placeholder="01000000000"
              className="h-12 w-full rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#111111] outline-none focus:border-black"
            />
            <div className="flex justify-end">
              <span className="text-xs text-[#666666]">{`${phoneLength}/11`}</span>
            </div>
          </section>
          {/* 이름 출력 */}
          <section className="flex w-full flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-bold break-words whitespace-pre-wrap text-[#1A1A1A]">
                이름
              </span>
            </div>
            <input
              value={user.name}
              placeholder="이름"
              readOnly
              disabled
              className="h-12 w-full rounded-lg border border-[#e6e6e6] bg-[#f2f2f2] px-4 py-3 text-[#7a7a7a] outline-none focus:border-black"
            />
          </section>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="mb-6 w-full cursor-pointer rounded-lg bg-[#4a4a4a] py-3 text-sm text-white"
        >
          수정하기
        </button>
      </form>
    </section>
  );
}
