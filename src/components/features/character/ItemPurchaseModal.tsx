'use client';
import Modal, { ModalBackdrop, ModalPanel } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { updateUserInfo } from '@/data/actions/user';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useItemStore } from '@/store/item.store';
import { usePointStore } from '@/store/point';
import { Item } from '@/types';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
  item: Item;
}

export default function ItemPurchaseModal({ onClose, item }: Props) {
  const { subtractPoint, point } = usePointStore();
  const { ownedItems, setOwnedItems } = useItemStore();
  const { accessToken, user } = useAuthStore();
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (price: number) => {
    if (!accessToken || !user?._id) return null;
    if (point < price) {
      setError('포인트가 부족합니다');
      return;
    }
    setIsLoading(true);

    const newPoint = point - price;
    const updatedCodes = Array.from(new Set([...ownedItems, item.code]));

    const formData = new FormData();
    formData.append('accessToken', accessToken);
    formData.append('point', String(newPoint));
    formData.append('ownedItemCodes', JSON.stringify(updatedCodes));
    console.log([...formData.entries()]);

    const res = await updateUserInfo(user._id, formData);
    setIsLoading(false);
    if (res.ok === 1) {
      console.log('포인트 수정됨');
      subtractPoint(price);
      setOwnedItems(updatedCodes);
      setIsSuccess(true);
    } else {
      console.error('구매 실패: ', res.message);
    }
  };
  return (
    <Modal key={'purchase-modal'} onClose={() => !isLoading && onClose()}>
      <ModalBackdrop className={cn(isSuccess && 'bg-[rgba(1,1,1,0.7)]')} />
      <ModalPanel
        disableStopPropagation={isSuccess}
        className={cn(
          'relative flex w-2/3 max-w-[400px] flex-col items-center justify-center gap-2 bg-transparent p-6 text-center',
          isSuccess ? 'border-none bg-transparent' : 'bg-white',
        )}
      >
        {isSuccess ? (
          <>
            <Image src={item.image} alt={item.name} width={300} height={300} />

            <p className="text-xl font-semibold whitespace-pre-line text-white">
              {item.name}
            </p>
            <p className="text-lg font-semibold whitespace-pre-line text-white">
              구매가 완료되었습니다!
            </p>
          </>
        ) : error ? (
          <>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/character/character-sad.webp" // 포인트 부족 이미지
                alt="포인트 부족"
                width={200}
                height={200}
              />
              <p className="text-center font-medium whitespace-pre-line select-none">
                {error}
              </p>
              <X
                onClick={onClose}
                className="absolute top-4 right-4 cursor-pointer"
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold whitespace-pre-line text-gray-900 select-none">
              {item.name}
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <Image
                src="/images/etc/point.webp"
                alt="포인트 테스트"
                width={50}
                height={50}
              />
              <X />
              <span className="text-2xl">{item.price}</span>
            </div>

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={onClose}
              >
                닫기
              </Button>
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => handlePurchase(item.price)}
                disabled={isLoading}
              >
                구매하기
              </Button>
            </div>
          </>
        )}
      </ModalPanel>
    </Modal>
  );
}
