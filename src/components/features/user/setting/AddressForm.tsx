'use client';

import { useEffect, useState } from 'react';
import { Address } from 'react-daum-postcode';
import Postcode from 'react-daum-postcode';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Map } from 'lucide-react';
import { getUserAttribute, updateUserInfo } from '@/data/actions/user';
import { useAuthStore } from '@/store/auth.store';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

//          interface: 주소 폼 입력 타입 정의          //
interface FormValues {
  address?: string;
  detail?: string;
  postcode?: string;
}

//          component: 주소 폼 컴포넌트          //
export default function AddressForm({ address, detail, postcode }: FormValues) {
  //          state: 주소 입력 폼 오픈 상태          //
  const [isOpen, setIsOpen] = useState(false);
  //          state: 로그인 유저 상태          //
  const currentUser = useAuthStore(state => state.user);
  //          state: accessToken 상태          //
  const accessToken = useAuthStore(state => state.accessToken);

  const { register, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      address: address ?? '',
      detail: detail ?? '',
      postcode: postcode ?? '',
    },
  });

  const toggleOpen = () => setIsOpen(prev => !prev);

  const onComplete = (data: Address) => {
    setValue('address', data.address);
    setValue('postcode', data.zonecode);
  };

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const fetchAddress = async () => {
  //     if (!currentUser?._id) return;

  //     if (addressRes.ok && addressDetailRes.ok) {
  //       setValue('address', addressRes.item.address);
  //       setValue('detail', addressDetailRes.item.extra.detail_address);
  //     }
  //   };

  //   fetchAddress();
  // }, [currentUser, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) return;

    if (!accessToken) {
      console.error('AccessToken 없음');
      return;
    }

    const formData = new FormData();
    formData.append('accessToken', accessToken);
    formData.append('address', data.address ?? '');
    formData.append('postcode', data.postcode ?? '');
    formData.append('detail', data.detail ?? '');
    if (!currentUser?._id) return;
    const res = await updateUserInfo(currentUser._id, formData);
    if (res.ok === 1) {
      toast.success('배송지가 변경되었습니다');
    } else {
      console.error(res);
    }
  };

  return (
    <>
      <li className="flex items-center gap-2.5 py-4">
        <Map />
        <span className="flex-1">배송지 관리</span>
        <button type="button" onClick={toggleOpen} aria-label="주소 폼 토글">
          {isOpen ? (
            <ChevronUp size={20} className="cursor-pointer" />
          ) : (
            <ChevronDown size={20} className="cursor-pointer" />
          )}
        </button>
      </li>
      {isOpen && (
        <form
          id="address-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex flex-col gap-2 px-3"
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">주소</span>
              <div className="flex items-center gap-3">
                <input
                  {...register('postcode')}
                  className="h-9 w-22 rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#111111] outline-none focus:border-black"
                  placeholder="우편번호"
                  readOnly
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="cursor-pointer"
                >
                  저장
                </Button>
              </div>
            </div>

            <input
              {...register('address')}
              placeholder="주소 입력은 아래 검색 창을 통해 가능합니다"
              className="h-12 w-full rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#111111] outline-none focus:border-black"
              readOnly
            />
          </div>
          <input
            {...register('detail')}
            placeholder="나머지 주소를 입력하세요 (예: 101동 202호)"
            className="h-12 w-full rounded-lg border border-[#e6e6e6] px-4 py-3 text-[#111111] outline-none focus:border-black"
          />

          <div className="mt-3 overflow-hidden rounded-md border">
            <Postcode
              onComplete={onComplete}
              autoClose={false}
              className="h-[400px] w-full"
            />
          </div>
        </form>
      )}
    </>
  );
}
