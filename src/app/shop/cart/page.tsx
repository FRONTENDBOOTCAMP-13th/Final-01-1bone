'use client';

import { CartProvider } from '@/components/features/shop/ProductDetail/CartContext';

import { useCart } from '@/components/features/shop/ProductDetail/CartContext';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  );
  const {
    cartItems,
    setQuantity,
    removeFromCart,
    toggleCheckItem,
    checkAll,
    uncheckAll,
    removeSelectedItems,
    getTotalCheckedPrice,
  } = useCart();

  const isAllChecked =
    cartItems.length > 0 && cartItems.every(i => i.isChecked);

  if (cartItems.length === 0)
    return <p className="py-10 text-center">장바구니가 비어 있습니다.</p>;
}

function CartPageContent() {
  const {
    cartItems,
    setQuantity,
    removeFromCart,
    toggleCheckItem,
    checkAll,
    uncheckAll,
    removeSelectedItems,
    getTotalCheckedPrice,
  } = useCart();

  // 주문완료 안내 페이지 이동

  const router = useRouter();

  const isAllChecked =
    cartItems.length > 0 && cartItems.every(item => item.isChecked);

  if (cartItems.length === 0)
    return <p className="py-10 text-center">장바구니가 비어 있습니다.</p>;

  return (
    <main className="mx-auto max-w-2xl p-4">
      {/* 전체 선택 영역 */}

      <div className="mb-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={e => (e.target.checked ? checkAll() : uncheckAll())}
        />
        <span className="font-semibold">전체 선택</span>
        <button
          className="ml-auto text-sm text-pink-500"
          onClick={() => {
            if (cartItems.filter(i => i.isChecked).length === 0) {
              alert('삭제할 상품을 선택해주세요.');
              return;
            }
            removeSelectedItems();
          }}
        >
          선택삭제
        </button>
      </div>

      <hr />

      {/* 장바구니 상품목록 */}
      <div className="space-y-6 py-3">
        {cartItems.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded bg-gray-50 p-2"
          >
            <input
              type="checkbox"
              checked={!!item.isChecked}
              onChange={e => toggleCheckItem(item.id, e.target.checked)}
              className="mr-2"
            />
            {item.item.mainImages ? (
              <Image
                src={item.item.mainImages.path}
                alt={item.item.name}
                width={60}
                height={60}
                className="rounded object-cover"
              />
            ) : (
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-gray-200 text-xs">
                이미지없음
              </div>
            )}

            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">
                단가: {item.item.price.toLocaleString()}원
              </span>
            </div>
            <div className="m-2 flex items-center gap-1">
              <button
                type="button"
                className="rounded bg-gray-200 px-2"
                disabled={item.item.quantity <= 1}
                onClick={() =>
                  setQuantity(item.id, Math.max(1, item.item.quantity - 1))
                }
              >
                -
              </button>
              <span className="w-6 text-center font-medium">
                {item.item.quantity}
              </span>
              <button
                type="button"
                className="rounded bg-gray-200 px-2"
                onClick={() => setQuantity(item.id, item.item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="w-20 text-right font-bold">
              {(item.item.price * item.item.quantity).toLocaleString()}원
            </div>
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-400"
              onClick={() => removeFromCart(item.id)}
              title="삭제"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* 결제정보 */}

      <section className="my-6 ml-4 flex flex-col gap-y-4">
        <div className="flex justify-between">
          <span className="text-[#4B5563]">총 상품금액</span>

          <span className="absolute right-4 font-medium">
            {getTotalCheckedPrice().toLocaleString()}원
          </span>
        </div>

        <div className="mt-1 flex justify-between">
          <span className="text-[#4B5563]">배송비</span>

          <span className="absolute right-4">무료</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-xl font-bold">
          <span className="text-lg leading-6 font-semibold">총 결제금액</span>

          <span className="absolute right-4 text-lg leading-6 font-semibold text-[#6E67DA]">
            {getTotalCheckedPrice().toLocaleString()}원
          </span>
        </div>
      </section>

      {/* 결제하기 버튼 */}
      <div className="mt-2 text-center">
        <button
          className="w-full rounded bg-pink-500 py-3 text-lg font-semibold text-white hover:bg-pink-600"
          onClick={() => {
            if (cartItems.filter(i => i.isChecked).length === 0) {
              alert('결제할 상품을 선택해주세요.');
              return;
            }
            alert(
              `${getTotalCheckedPrice().toLocaleString()}원 결제가 완료되었습니다.`,
            );
            removeSelectedItems();
          }}
        >
          선택상품 결제하기
        </button>
      </div>
    </main>
  );
}

// 'use client';

// import CartItemCard from '@/components/features/shopping-cart/CartItemCard';
// import {
//   Banknote,
//   ChevronLeft,
//   CreditCard,
//   MapPin,
//   WalletCards,
//   X,
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';

// function CartPage() {
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [ispaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
//   const [totalPrice, setTotalPrice] = useState(0);

//   // 임시로 넣어놓은 데이터
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       productImg: '',
//       name: '상품 제목을 입력해주세요.',
//       price: 20000,
//       quantity: 1,
//       isChecked: false,
//     },
//     {
//       id: 2,
//       productImg: '',
//       name: '상품 제목을 입력해주세요.',
//       price: 15000,
//       quantity: 1,
//       isChecked: false,
//     },
//     {
//       id: 3,
//       productImg: '',
//       name: '상품 제목을 입력해주세요.',
//       price: 30000,
//       quantity: 1,
//       isChecked: false,
//     },
//   ]);

//   // 전체 상품 선택/해제
//   const handleAllSelect = () => {
//     const newCheckedState = !isAllChecked;
//     setIsAllChecked(newCheckedState);

//     const updatedItems = cartItems.map(item => ({
//       ...item,
//       isChecked: newCheckedState,
//     }));

//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 개별 상품 선택/해제
//   const handleItemCheck = (id: number, checked: boolean) => {
//     const updatedItems = cartItems.map(item =>
//       item.id === id ? { ...item, isChecked: checked } : item,
//     );

//     const allChecked = updatedItems.every(item => item.isChecked);
//     setIsAllChecked(allChecked);
//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 선택된 상품을 선택삭제를 통해 제거
//   const handleSelectedRemove = () => {
//     const selectedItems = cartItems.filter(item => item.isChecked);

//     if (selectedItems.length === 0) {
//       alert('삭제할 상품을 선택해주세요.');
//       return;
//     } else {
//       const updatedItems = cartItems.filter(item => !item.isChecked);
//       setCartItems(updatedItems);
//       setIsAllChecked(false);
//       updateTotalPrice(updatedItems);
//     }
//   };

//   // 개별 상품 삭제
//   const handleRemoveItem = (id: number) => {
//     const updatedItems = cartItems.filter(item => item.id !== id);
//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 상품 수량 변경
//   const handleQuantityChange = (id: number, quantity: number) => {
//     const updatedItems = cartItems.map(item =>
//       item.id === id ? { ...item, quantity } : item,
//     );
//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 총 상품금액 업데이트
//   const updateTotalPrice = (items: typeof cartItems) => {
//     const total = items.reduce((acc, item) => {
//       if (item.isChecked) {
//         return acc + item.price * item.quantity;
//       }
//       return acc;
//     }, 0);
//     setTotalPrice(total);
//   };

//   const handleOpenPaymentSheet = () => {
//     setIsPaymentSheetOpen(true);
//   };

//   const handleClosePaymentSheet = () => {
//     setIsPaymentSheetOpen(false);
//   };

//   const handlePayment = () => {
//     alert('결제가 완료되었습니다.');
//     setIsPaymentSheetOpen(false);
//   };

//   return (
//     <div className="flex flex-col">
//       {/* 상단 */}
//       {/* <div className="mt-10">
//         <Link href="/shop" className="relative top-7 left-4" prefetch>
//           <ChevronLeft size={24} />
//         </Link>
//         <p className="text-center text-lg leading-6 font-semibold">장바구니</p>
//       </div>
//       <hr className="mt-10" /> */}

//       {/* 전체 선택 */}
//       <div className="relative flex">
//         <button
//           onClick={handleAllSelect}
//           aria-label={isAllChecked ? '전체 상품 선택' : '전체 상품 선택 해제'}
//           className="absolute top-3.5"
//         >
//           {isAllChecked ? (
//             <Image
//               src="/check-on.svg"
//               alt="전체 선택 설정 버튼"
//               width={20}
//               height={20}
//               className="ml-5"
//             />
//           ) : (
//             <Image
//               src="/check-off.svg"
//               alt="전체 선택 설정 버튼"
//               width={20}
//               height={20}
//               className="ml-5"
//             />
//           )}
//         </button>
//         <span className="relative top-3 left-14 text-lg leading-6 font-semibold">
//           전체 선택
//         </span>
//         <button
//           className="absolute top-3 right-5 text-[#FE5088]"
//           onClick={handleSelectedRemove}
//         >
//           선택삭제
//         </button>
//       </div>
//       <hr className="my-6" />

//       {/* 장바구니에 담긴 상품 리스트 */}
//       <div>
//         {cartItems.map(item => (
//           <CartItemCard
//             key={item.id}
//             id={item.id}
//             productImg={item.productImg}
//             name={item.name}
//             price={item.price}
//             quantity={item.quantity}
//             isChecked={item.isChecked}
//             onCheck={handleItemCheck}
//             onQuantityChange={handleQuantityChange}
//             onRemove={handleRemoveItem}
//           />
//         ))}
//       </div>

//       {/* 결제 정보 */}
//       <div className="my-6 ml-4 flex flex-col gap-y-4">
//         <div>
//           <span className="text-[#4B5563]">총 상품금액</span>
//           <span className="absolute right-4 font-medium">{totalPrice}원</span>
//         </div>
//         <div>
//           <span className="text-[#4B5563]">배송비</span>
//           <span className="absolute right-4">무료</span>
//         </div>
//         <div>
//           <span className="text-lg leading-6 font-semibold">총 결제금액</span>
//           <span className="absolute right-4 text-lg leading-6 font-semibold text-[#6E67DA]">
//             {totalPrice}원
//           </span>
//         </div>
//       </div>

//       {/* 결제 버튼 */}
//       <div className="relative top-3 text-center">
//         <button
//           className="h-[3.5rem] w-[21.875rem] cursor-pointer rounded-md bg-[#FE508B] text-xl font-semibold text-white hover:bg-[#e6457b]"
//           onClick={handleOpenPaymentSheet}
//         >
//           결제하기
//         </button>
//       </div>

//       {ispaymentSheetOpen && (
//         <div className="fixed inset-0 flex items-end">
//           <div className="mx-auto w-full max-w-[600px] rounded-t-3xl bg-white">
//             {/* 바텀시트 헤더 */}
//             <div className="flex items-center justify-between rounded-t-2xl border-t-2 px-6 py-6">
//               <h2 className="text-lg leading-6 font-semibold">결제하기</h2>
//               <button onClick={handleClosePaymentSheet} className="p-1">
//                 <X size={18} />
//               </button>
//             </div>
//             <hr />

//             <div className="max-h-[60vh] px-6 py-4">
//               {/* 배송지 */}
//               <div className="mb-6">
//                 <h3 className="mb-3.5 text-lg leading-6 font-semibold">
//                   배송지
//                 </h3>
//                 <div className="flex items-start">
//                   <MapPin />
//                   <div className="flex-1">
//                     <p className="pl-2.5 font-semibold">홍길동</p>
//                     <p className="mt-1 pl-2.5 text-sm text-[#4B5563]">
//                       서울특별시 강남구 테헤란로 123
//                     </p>
//                     <p className="pl-2.5 text-sm text-[#4B5563]">
//                       삼성아파트 111호 1001호
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <hr className="-mx-6" />

//               {/* 결제수단 */}
//               <div className="mt-4">
//                 <h3 className="mb-4 text-lg font-bold">결제수단</h3>
//                 <div className="space-y-3">
//                   {/* 신용카드 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                       defaultChecked
//                     />
//                     <div className="flex items-center">
//                       <CreditCard />
//                       <span className="pl-2.5">신용카드</span>
//                     </div>
//                   </label>

//                   {/* 무통장입금 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                     />
//                     <div className="flex items-center">
//                       <Banknote />
//                       <span className="pl-2.5">무통장입금</span>
//                     </div>
//                   </label>

//                   {/* 간편결제 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                     />
//                     <div className="flex items-center">
//                       <WalletCards />
//                       <span className="pl-2.5">간편결제</span>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* 결제 버튼 */}
//             <div className="px-4 py-3 text-center">
//               <button
//                 className="h-[3.5rem] w-[21.875rem] cursor-pointer rounded-md bg-[#FE508B] text-xl font-semibold text-white hover:bg-[#e6457b]"
//                 onClick={handlePayment}
//               >
//                 결제하기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// export default CartPage;

// 'use client';

// import CartItemCard from '@/components/features/shopping-cart/CartItemCard';
// import {
//   fetchCartList,
//   deleteCartItem,
//   updateCartItemQuantity,
// } from '@/data/functions/CartFetch.client';
// import {
//   Banknote,
//   ChevronLeft,
//   CreditCard,
//   MapPin,
//   WalletCards,
//   X,
// } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// // function CartPage() {
// //   const [isAllChecked, setIsAllChecked] = useState(false);
// //   const [ispaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
// //   const [totalPrice, setTotalPrice] = useState(0);
// //   const [cartItems, setCartItems] = useState([]);

// //   // 장바구니 데이터 초기화
// //   useEffect(() => {
// //     const loadCartItems = async () => {
// //       try {
// //         const data = await fetchCartList(1);
// //         setCartItems(data.items);
// //         updateTotalPrice(data.items);
// //       } catch (error) {
// //         console.error('장바구니 데이터를 불러오는 중 오류 발생:', error);
// //       }
// //     };

// //     loadCartItems();
// //   }, []);

// // type CartItem = {
// //   id: number;
// //   productImg: string;
// //   name: string;
// //   price: number;
// //   quantity: number;
// //   isChecked: boolean;
// // };

// function CartPage() {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [ispaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     const loadCartItems = async () => {
//       try {
//         const data = await fetchCartList(1);
//         const items: CartItem[] = data.items.map(item => ({
//           id: item.id,
//           productImg: item.productImg || '',
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           isChecked: false, // Default value
//         }));
//         setCartItems(items);
//         updateTotalPrice(items);
//       } catch (error) {
//         console.error('장바구니 데이터를 불러오는 중 오류 발생:', error);
//       }
//     };

//     loadCartItems();
//   }, []);

//   // 전체 상품 선택/해제
//   const handleAllSelect = () => {
//     const newCheckedState = !isAllChecked;
//     setIsAllChecked(newCheckedState);

//     const updatedItems = cartItems.map(item => ({
//       ...item,
//       isChecked: newCheckedState,
//     }));

//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 개별 상품 선택/해제
//   const handleItemCheck = (id: number, checked: boolean) => {
//     const updatedItems = cartItems.map(item =>
//       item.id === id ? { ...item, isChecked: checked } : item,
//     );

//     const allChecked = updatedItems.every(item => item.isChecked);
//     setIsAllChecked(allChecked);
//     setCartItems(updatedItems);
//     updateTotalPrice(updatedItems);
//   };

//   // 선택된 상품을 선택삭제를 통해 제거
//   const handleSelectedRemove = async () => {
//     const selectedItems = cartItems.filter(item => item.isChecked);

//     if (selectedItems.length === 0) {
//       alert('삭제할 상품을 선택해주세요.');
//       return;
//     }

//     try {
//       await Promise.all(selectedItems.map(item => deleteCartItem(item.id)));
//       const updatedItems = cartItems.filter(item => !item.isChecked);
//       setCartItems(updatedItems);
//       setIsAllChecked(false);
//       updateTotalPrice(updatedItems);
//     } catch (error) {
//       console.error('선택 삭제 중 오류 발생:', error);
//       alert('선택 삭제에 실패했습니다.');
//     }
//   };

//   // 개별 상품 삭제
//   const handleRemoveItem = async (id: number) => {
//     try {
//       await deleteCartItem(id);
//       const updatedItems = cartItems.filter(item => item.id !== id);
//       setCartItems(updatedItems);
//       updateTotalPrice(updatedItems);
//     } catch (error) {
//       console.error('상품 삭제 중 오류 발생:', error);
//       alert('상품 삭제에 실패했습니다.');
//     }
//   };

//   // 상품 수량 변경
//   const handleQuantityChange = async (id: number, quantity: number) => {
//     try {
//       await updateCartItemQuantity(id, quantity);
//       const updatedItems = cartItems.map(item =>
//         item.id === id ? { ...item, quantity } : item,
//       );
//       setCartItems(updatedItems);
//       updateTotalPrice(updatedItems);
//     } catch (error) {
//       console.error('수량 변경 중 오류 발생:', error);
//       alert('수량 변경에 실패했습니다.');
//     }
//   };

//   // 총 상품금액 업데이트
//   const updateTotalPrice = (items: typeof cartItems) => {
//     const total = items.reduce((acc, item) => {
//       if (item.isChecked) {
//         return acc + item.price * item.quantity;
//       }
//       return acc;
//     }, 0);
//     setTotalPrice(total);
//   };

//   const handleOpenPaymentSheet = () => {
//     setIsPaymentSheetOpen(true);
//   };

//   const handleClosePaymentSheet = () => {
//     setIsPaymentSheetOpen(false);
//   };

//   const handlePayment = async () => {
//     const selectedItems = cartItems.filter(item => item.isChecked);

//     if (selectedItems.length === 0) {
//       alert('결제할 상품을 선택해주세요.');
//       return;
//     }

//     try {
//       alert(`${totalPrice.toLocaleString()}원 결제가 완료되었습니다.`);
//       setCartItems(cartItems.filter(item => !item.isChecked));
//       setIsAllChecked(false);
//       updateTotalPrice([]);
//     } catch (error) {
//       console.error('결제 처리 중 오류 발생:', error);
//       alert('결제에 실패했습니다.');
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       {/* 상단 */}
//       <div className="relative flex">
//         <button
//           onClick={handleAllSelect}
//           aria-label={isAllChecked ? '전체 상품 선택' : '전체 상품 선택 해제'}
//           className="absolute top-3.5"
//         >
//           {isAllChecked ? (
//             <Image
//               src="/check-on.svg"
//               alt="전체 선택 설정 버튼"
//               width={20}
//               height={20}
//               className="ml-5"
//             />
//           ) : (
//             <Image
//               src="/check-off.svg"
//               alt="전체 선택 설정 버튼"
//               width={20}
//               height={20}
//               className="ml-5"
//             />
//           )}
//         </button>
//         <span className="relative top-3 left-14 text-lg leading-6 font-semibold">
//           전체 선택
//         </span>
//         <button
//           className="absolute top-3 right-5 text-[#FE5088]"
//           onClick={handleSelectedRemove}
//         >
//           선택삭제
//         </button>
//       </div>
//       <hr className="my-6" />

//       {/* 장바구니에 담긴 상품 리스트 */}
//       <div>
//         {cartItems.map(item => (
//           <CartItemCard
//             key={item.id}
//             id={item.id}
//             productImg={item.productImg}
//             name={item.name}
//             price={item.price}
//             quantity={item.quantity}
//             isChecked={item.isChecked}
//             onCheck={handleItemCheck}
//             onQuantityChange={handleQuantityChange}
//             onRemove={handleRemoveItem}
//           />
//         ))}
//       </div>

//       {/* 결제 정보 */}
//       <div className="my-6 ml-4 flex flex-col gap-y-4">
//         <div>
//           <span className="text-[#4B5563]">총 상품금액</span>
//           <span className="absolute right-4 font-medium">{totalPrice}원</span>
//         </div>
//         <div>
//           <span className="text-[#4B5563]">배송비</span>
//           <span className="absolute right-4">무료</span>
//         </div>
//         <div>
//           <span className="text-lg leading-6 font-semibold">총 결제금액</span>
//           <span className="absolute right-4 text-lg leading-6 font-semibold text-[#6E67DA]">
//             {totalPrice}원
//           </span>
//         </div>
//       </div>

//       {/* 결제 버튼 */}
//       <div className="relative top-3 text-center">
//         <button
//           className="h-[3.5rem] w-[21.875rem] cursor-pointer rounded-md bg-[#FE508B] text-xl font-semibold text-white hover:bg-[#e6457b]"
//           onClick={handleOpenPaymentSheet}
//         >
//           결제하기
//         </button>
//       </div>

//       {ispaymentSheetOpen && (
//         <div className="fixed inset-0 flex items-end">
//           <div className="mx-auto w-full max-w-[600px] rounded-t-3xl bg-white">
//             {/* 바텀시트 헤더 */}
//             <div className="flex items-center justify-between rounded-t-2xl border-t-2 px-6 py-6">
//               <h2 className="text-lg leading-6 font-semibold">결제하기</h2>
//               <button onClick={handleClosePaymentSheet} className="p-1">
//                 <X size={18} />
//               </button>
//             </div>
//             <hr />

//             <div className="max-h-[60vh] px-6 py-4">
//               {/* 배송지 */}
//               <div className="mb-6">
//                 <h3 className="mb-3.5 text-lg leading-6 font-semibold">
//                   배송지
//                 </h3>
//                 <div className="flex items-start">
//                   <MapPin />
//                   <div className="flex-1">
//                     <p className="pl-2.5 font-semibold">홍길동</p>
//                     <p className="mt-1 pl-2.5 text-sm text-[#4B5563]">
//                       서울특별시 강남구 테헤란로 123
//                     </p>
//                     <p className="pl-2.5 text-sm text-[#4B5563]">
//                       삼성아파트 111호 1001호
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <hr className="-mx-6" />

//               {/* 결제수단 */}
//               <div className="mt-4">
//                 <h3 className="mb-4 text-lg font-bold">결제수단</h3>
//                 <div className="space-y-3">
//                   {/* 신용카드 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                       defaultChecked
//                     />
//                     <div className="flex items-center">
//                       <CreditCard />
//                       <span className="pl-2.5">신용카드</span>
//                     </div>
//                   </label>

//                   {/* 무통장입금 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                     />
//                     <div className="flex items-center">
//                       <Banknote />
//                       <span className="pl-2.5">무통장입금</span>
//                     </div>
//                   </label>

//                   {/* 간편결제 */}
//                   <label className="flex items-center p-3">
//                     <input
//                       type="radio"
//                       name="payment"
//                       className="mr-3 h-5 w-5"
//                     />
//                     <div className="flex items-center">
//                       <WalletCards />
//                       <span className="pl-2.5">간편결제</span>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* 결제 버튼 */}
//             <div className="px-4 py-3 text-center">
//               <button
//                 className="h-[3.5rem] w-[21.875rem] cursor-pointer rounded-md bg-[#FE508B] text-xl font-semibold text-white hover:bg-[#e6457b]"
//                 onClick={handlePayment}
//               >
//                 결제하기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CartPage;
