'use client';

import { OrderProducts } from '@/components/features/shopping-order/detail/OrderProducts';
import {
  OrderedAddress,
  OrderedCost,
  OrderedUser,
  OrderProductType,
} from '@/types/orders';

export default function OrderDetailClient({
  orderId,
  user,
  address,
  payment,
  cost,
  products,
}: {
  orderId: number;
  user: OrderedUser;
  address: OrderedAddress;
  payment: string;
  cost: OrderedCost;
  products: OrderProductType[];
}) {
  const totalOriginalProducts = products.reduce((sum, p) => {
    if (!p.extra.originalPrice) return cost.total;
    return sum + p.extra.originalPrice * p.quantity;
  }, 0);

  const totalSale = totalOriginalProducts - cost.total || 0;

  const paymentLabel: Record<string, string> = {
    card: '신용카드',
    cash: '무통장입금',
    simple: '간편결제',
  };

  console.log('payment', payment);

  return (
    <>
      <section>
        <div>
          <div className="mx-3.5 rounded-2xl border border-[#EAEAEA] p-3">
            <h2 className="border-b border-b-[#EAEAEA] pb-2 text-lg font-bold">
              주문 상품 {products.length}개
            </h2>
            <OrderProducts products={products} />
          </div>

          <div className="my-5 h-2 w-full bg-[#F3F4F6]"></div>

          <div className="mx-3.5">
            <h2 className="mb-2 border-b border-b-[#EAEAEA] pb-2 text-lg font-bold">
              배송 정보
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-4 text-sm">
              <dt className="text-[#4B5563]">수령인</dt>
              <dd>{user.name} </dd>

              <dt className="text-[#4B5563]">휴대폰</dt>
              <dd>
                {user.phone?.replace(/(\d{3})(\d{4})(\d{4})/, `$1-$2-$3`)}
              </dd>

              <dt className="text-[#4B5563]">주소</dt>
              <dd>
                {' '}
                [{address.postcode}] {address.address}{' '}
                {address.detailAddress && `(${address.detailAddress})`}
              </dd>
            </dl>
          </div>

          <div className="my-5 h-2 w-full bg-[#F3F4F6]"></div>

          <div className="mx-3.5 mb-5">
            <h2 className="border-b border-b-[#EAEAEA] pb-2 text-lg font-bold">
              결제 내역
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-4 py-2 text-sm">
              <dt>결제 수단</dt>
              <dd className="text-right">{paymentLabel[payment]}</dd>

              <dt>총 상품 금액</dt>
              <dd className="text-right">
                {totalOriginalProducts.toLocaleString()}원
              </dd>

              <dt>할인 금액</dt>
              <dd className="text-right">-{totalSale.toLocaleString()}원</dd>
            </dl>

            <span className="mt-2 flex w-full justify-between border-t border-t-[#EAEAEA] pt-2 font-bold">
              <h3>총 결제 금액</h3>
              <p>{cost.total.toLocaleString()}원</p>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
