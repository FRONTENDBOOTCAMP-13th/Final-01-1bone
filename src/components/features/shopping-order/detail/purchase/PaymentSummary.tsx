import { usePurchaseStore } from '@/store/order.store';

export function PaymentSummary() {
  const { purchaseData } = usePurchaseStore();

  const totals = purchaseData.reduce(
    (acc, product) => {
      const { price, originalPrice = price, quantity } = product;
      acc.total += price * quantity;
      acc.originalTotal += originalPrice * quantity;
      acc.sale += (originalPrice - price) * quantity;
      return acc;
    },
    { total: 0, originalTotal: 0, sale: 0 },
  );

  return (
    <div className="mx-3.5 mb-5">
      <span className="mb-2 flex w-full justify-between border-b border-b-[#EAEAEA] pb-2 text-lg font-bold">
        <h2>총 결제 금액</h2>
        <p>{totals.total.toLocaleString()}원</p>
      </span>
      <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-4 py-2 text-sm">
        <dt>총 상품 금액</dt>
        <dd className="text-right">
          {totals.originalTotal.toLocaleString()}원
        </dd>
        <dt>할인 금액</dt>
        <dd className="text-right">-{totals.sale.toLocaleString()}원</dd>
      </dl>
    </div>
  );
}
