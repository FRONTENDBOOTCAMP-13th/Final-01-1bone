// // 'use client';

// // import { useState } from 'react';
// // import { useSwipeable } from 'react-swipeable';
// // import {
// //   ProductActionButtons,
// //   TotalPrice,
// // } from '@/components/features/shop/ProductDetail/ProductDetail';
// // import { OptionSelector } from '@/components/features/shop/ProductDetail/OptionSelector';
// // import { ProductQuantitySelector } from '@/components/features/shop/ProductDetail/ProductDetail';
// // import { ProductOption } from '@/types/product';
// // import {
// //   fetchAddToCart,
// //   fetchCartList,
// // } from '@/data/functions/CartFetch.client';

// // export default function CartAction({
// //   price,
// //   options,
// //   discountRate,
// //   item,
// // }: {
// //   price: number;
// //   options: ProductOption[];
// //   discountRate: number;
// //   item: { id: string; name: string; price: number; productImg?: string };
// // }) {
// //   const [selectedOptions, setSelectedOptions] = useState<{
// //     [key: string]: string;
// //   }>({});
// //   const [quantity, setQuantity] = useState(1);
// //   const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

// //   const hasOptions = Array.isArray(options) && options.length > 0;
// //   const allOptionsSelected =
// //     !hasOptions || options.every(opt => selectedOptions[opt.name]);
// //   const discountedPrice = price * (1 - discountRate / 100);

// //   const handleOptionChange = (name: string, value: string) => {
// //     setSelectedOptions(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleAddToCart = async () => {
// //     try {
// //       // 장바구니에 상품 추가
// //       await fetchAddToCart(Number(item.id), quantity);

// //       // 장바구니 데이터 갱신
// //       const updatedCart = await fetchCartList(1); // 페이지 번호는 1로 설정
// //       console.log('장바구니 갱신 완료:', updatedCart);
// //       alert('장바구니에 상품이 추가되었습니다.');
// //     } catch (error) {
// //       console.error('장바구니 추가 중 오류 발생:', error);
// //       alert('장바구니 추가에 실패했습니다.');
// //     }
// //   };

// //   const swipeHandlers = useSwipeable({
// //     onSwipedDown: () => setIsBottomSheetOpen(false),
// //     trackMouse: true,
// //   });

// //   return (
// //     <>
// //       {/* 상품 액션 버튼 */}
// //       <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-5 py-3">
// //         <ProductActionButtons
// //           onCartClick={() => {
// //             setIsBottomSheetOpen(true);
// //             setQuantity(1);
// //           }}
// //         />
// //       </div>

// //       {/* 바텀시트 어두운 배경 */}
// //       {isBottomSheetOpen && (
// //         <div className="fixed inset-0 z-10 flex items-center justify-center">
// //           <div className="h-full w-full max-w-[600px] bg-black opacity-50"></div>
// //         </div>
// //       )}

// //       {/* 바텀시트 */}
// //       {isBottomSheetOpen && (
// //         <div
// //           {...swipeHandlers}
// //           className={`fixed z-20 flex w-full max-w-[600px] flex-col rounded-t-[16px] bg-white shadow-lg ${
// //             hasOptions ? 'bottom-[78px]' : 'bottom-[78px]'
// //           }`}
// //         >
// //           <div className="flex justify-center">
// //             <div className="mt-2.5 h-[4px] w-[109px] rounded-full bg-[#3D3D3D]" />
// //           </div>

// //           {hasOptions ? (
// //             <>
// //               {options.map(opt => (
// //                 <div key={opt.name} className="bg-white px-5 pt-3.5">
// //                   <OptionSelector
// //                     name={opt.name}
// //                     options={opt.values}
// //                     selectedOption={selectedOptions[opt.name] || ''}
// //                     onSelect={value => handleOptionChange(opt.name, value)}
// //                   />
// //                 </div>
// //               ))}

// //               {allOptionsSelected && (
// //                 <ProductQuantitySelector
// //                   selectedOption={
// //                     Object.values(selectedOptions).join(', ') || ''
// //                   }
// //                   quantity={quantity}
// //                   onIncrease={() => setQuantity(prev => prev + 1)}
// //                   onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
// //                   price={price}
// //                   discountedPrice={discountedPrice}
// //                   item={item}
// //                 />
// //               )}
// //               {allOptionsSelected && (
// //                 <TotalPrice quantity={quantity} price={discountedPrice} />
// //               )}
// //             </>
// //           ) : (
// //             <>
// //               <ProductQuantitySelector
// //                 selectedOption=""
// //                 quantity={quantity}
// //                 onIncrease={() => setQuantity(prev => prev + 1)}
// //                 onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
// //                 price={price}
// //                 discountedPrice={discountedPrice}
// //                 item={item}
// //               />
// //               <TotalPrice quantity={quantity} price={discountedPrice} />
// //             </>
// //           )}

// //           {/* 장바구니 담기 버튼 */}
// //           {allOptionsSelected && (
// //             <div className="px-5 py-3">
// //               <button
// //                 onClick={handleAddToCart}
// //                 className="w-full rounded bg-pink-500 py-3 text-lg font-semibold text-white hover:bg-pink-600"
// //               >
// //                 장바구니 담기
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import {
//   ProductActionButtons,
//   TotalPrice,
// } from '@/components/features/shop/ProductDetail/ProductDetail';
// import { OptionSelector } from '@/components/features/shop/ProductDetail/OptionSelector';
// import { ProductQuantitySelector } from '@/components/features/shop/ProductDetail/ProductDetail';
// import { ProductOption } from '@/types/product'; // ProductOption 타입 가져오기
// import {
//   fetchAddToCart,
//   fetchCartList,
// } from '@/data/functions/CartFetch.client';

// export default function CartAction({
//   price,
//   options,
//   discountRate,
//   item,
// }: {
//   price: number;
//   options: ProductOption[];
//   discountRate: number;
//   item: { id: string; name: string; price: number; productImg?: string };
// }) {
//   const [selectedOptions, setSelectedOptions] = useState<{
//     [key: string]: string;
//   }>({});
//   const [quantity, setQuantity] = useState(1);
//   const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

//   const hasOptions = Array.isArray(options) && options.length > 0;
//   const allOptionsSelected =
//     !hasOptions || options.every(opt => selectedOptions[opt.name]);
//   const discountedPrice = price * (1 - discountRate / 100);

//   const handleOptionChange = (name: string, value: string) => {
//     setSelectedOptions(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddToCart = async () => {
//     try {
//       // 장바구니에 상품 추가
//       await fetchAddToCart(Number(item.id), quantity);

//       // 장바구니 데이터 갱신
//       const updatedCart = await fetchCartList(1); // 페이지 번호는 1로 설정
//       console.log('장바구니 갱신 완료:', updatedCart);
//       alert('장바구니에 상품이 추가되었습니다.');
//     } catch (error) {
//       console.error('장바구니 추가 중 오류 발생:', error);
//       alert('장바구니 추가에 실패했습니다.');
//     }
//   };

//   const swipeHandlers = useSwipeable({
//     onSwipedDown: () => setIsBottomSheetOpen(false),
//     trackMouse: true,
//   });

//   return (
//     <>
//       {/* 상품 액션 버튼 */}
//       <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-5 py-3">
//         <ProductActionButtons
//           onCartClick={() => {
//             setIsBottomSheetOpen(true);
//             setQuantity(1);
//           }}
//         />
//       </div>

//       {/* 바텀시트 어두운 배경 */}
//       {isBottomSheetOpen && (
//         <div className="fixed inset-0 z-10 flex items-center justify-center">
//           <div className="h-full w-full max-w-[600px] bg-black opacity-50"></div>
//         </div>
//       )}

//       {/* 바텀시트 */}
//       {isBottomSheetOpen && (
//         <div
//           {...swipeHandlers}
//           className={`fixed z-20 flex w-full max-w-[600px] flex-col rounded-t-[16px] bg-white shadow-lg ${
//             hasOptions ? 'bottom-[78px]' : 'bottom-[78px]'
//           }`}
//         >
//           <div className="flex justify-center">
//             <div className="mt-2.5 h-[4px] w-[109px] rounded-full bg-[#3D3D3D]" />
//           </div>

//           {hasOptions ? (
//             <>
//               {options.map(opt => (
//                 <div key={opt.name} className="bg-white px-5 pt-3.5">
//                   <OptionSelector
//                     name={opt.name}
//                     options={opt.values}
//                     selectedOption={selectedOptions[opt.name] || ''}
//                     onSelect={value => handleOptionChange(opt.name, value)}
//                   />
//                 </div>
//               ))}

//               {allOptionsSelected && (
//                 <ProductQuantitySelector
//                   selectedOption={
//                     Object.values(selectedOptions).join(', ') || ''
//                   }
//                   quantity={quantity}
//                   onIncrease={() => setQuantity(prev => prev + 1)}
//                   onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
//                   price={price}
//                   discountedPrice={discountedPrice}
//                   item={item}
//                 />
//               )}
//               {allOptionsSelected && (
//                 <TotalPrice quantity={quantity} price={discountedPrice} />
//               )}
//             </>
//           ) : (
//             <>
//               <ProductQuantitySelector
//                 selectedOption=""
//                 quantity={quantity}
//                 onIncrease={() => setQuantity(prev => prev + 1)}
//                 onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
//                 price={price}
//                 discountedPrice={discountedPrice}
//                 item={item}
//               />
//               <TotalPrice quantity={quantity} price={discountedPrice} />
//             </>
//           )}

//           {/* 장바구니 담기 버튼 */}
//           {allOptionsSelected && (
//             <div className="px-5 py-3">
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full rounded bg-pink-500 py-3 text-lg font-semibold text-white hover:bg-pink-600"
//               >
//                 장바구니 담기
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// import Image from 'next/image';
// import Tabbar from '@/components/layout/tabbar/Tabbar';
// import { CartProvider } from '@/components/features/shop/ProductDetail/CartContext';
// import { ProductDetailInfo } from '@/components/features/shop/ProductDetail/ProductDetail';
// import { fetchProductDetail } from '@/data/functions/ProductFetch';
// import CartAction from '@/components/features/shop/ProductDetail/CartAction'; // 클라이언트 컴포넌트 직접 import
// import { ProductOption } from '@/types/product';

// export default async function ProductPage({
//   params,
// }: {
//   params: { productId: string };
// }) {
//   const { productId } = params;

//   if (!productId) {
//     return <div>상품 데이터를 불러올 수 없습니다.</div>;
//   }

//   const res = await fetchProductDetail(productId);
//   const product = res.item;

//   const mainImage = product.mainImages[0];
//   const detailImage = product.content[0];

//   const mainImageUrl = mainImage
//     ? `https://fesp-api.koyeb.app/market/${mainImage.path}`
//     : '';
//   const detailImageUrl = detailImage
//     ? `https://fesp-api.koyeb.app/market/${detailImage.path}`
//     : '';

//   const options = Array.isArray(product.extra.options)
//     ? product.extra.options
//     : [];

//   return (
//     <CartProvider>
//       <div className={`relative mb-1 aspect-square w-full`}>
//         <Image
//           fill
//           style={{ objectFit: 'cover', objectPosition: 'center' }}
//           src={mainImageUrl}
//           alt={mainImage?.name || '상품 이미지'}
//           className="pointer-events-none"
//         />
//       </div>

//       <ProductDetailInfo
//         item={{
//           _id: product._id,
//           name: product.name,
//           price: product.price,
//           path: detailImage?.path ?? '',
//         }}
//         discountRate={product.extra.discountRate}
//         discountedPrice={product.extra.discountedPrice}
//         extra={{ recommendedBy: product.extra.recommendedBy }}
//       />

//       <h2 className="p-5 text-[18px] font-semibold">상품정보</h2>
//       <div className="relative mb-1 w-full">
//         <Image
//           layout="intrinsic"
//           width={1920}
//           height={1080}
//           src={detailImageUrl}
//           alt={detailImage?.name || '상품 상세'}
//           className="pointer-events-none"
//         />
//       </div>

//       {/* 클라이언트 컴포넌트 사용 */}
//       <CartAction
//         price={product.price}
//         options={options}
//         discountRate={product.extra.discountRate}
//         item={{
//           id: String(product._id),
//           name: product.name,
//           price: product.price,
//           productImg: mainImageUrl,
//         }}
//       />

//       <Tabbar />
//     </CartProvider>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  ProductActionButtons,
  TotalPrice,
} from '@/components/features/shop/ProductDetail/ProductDetail';
import { OptionSelector } from '@/components/features/shop/ProductDetail/OptionSelector';
import { ProductQuantitySelector } from '@/components/features/shop/ProductDetail/ProductDetail';
import { ProductOption } from '@/types/product';
import {
  fetchAddToCart,
  fetchCartList,
} from '@/data/functions/CartFetch.client';

export default function CartAction({
  originalPrice,
  item,
  options,
  discountRate,
}: {
  originalPrice: number; // 원가를 독립적으로 전달
  item: { id: string; name: string; price: number; productImg?: string }; // 할인된 금액은 item.price로 사용
  options: ProductOption[];
  discountRate: number;
}) {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isReadyToAdd, setIsReadyToAdd] = useState(false);

  const hasOptions = Array.isArray(options) && options.length > 0;
  const allOptionsSelected =
    !hasOptions || options.every(opt => selectedOptions[opt.name]);

  useEffect(() => {
    setIsReadyToAdd(allOptionsSelected);
  }, [selectedOptions, allOptionsSelected]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = async () => {
    try {
      await fetchAddToCart(Number(item.id), quantity);
      const updatedCart = await fetchCartList(1);
      console.log('장바구니 갱신 완료:', updatedCart);
      alert('장바구니에 상품이 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 중 오류 발생:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setIsBottomSheetOpen(false),
    trackMouse: true,
  });

  return (
    <>
      <div className="bt-rounded-[8px] fixed bottom-0 z-30 w-full max-w-[600px] bg-white px-5 py-3">
        <ProductActionButtons
          onCartClick={() => {
            setIsBottomSheetOpen(true);
            setQuantity(1);
          }}
        />
      </div>

      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="h-full w-full max-w-[600px] bg-black opacity-50"></div>
        </div>
      )}

      {isBottomSheetOpen && (
        <div
          {...swipeHandlers}
          className={`fixed z-20 flex w-full max-w-[600px] flex-col rounded-t-[16px] bg-white shadow-lg ${
            hasOptions ? 'bottom-[78px]' : 'bottom-[78px]'
          }`}
        >
          <div className="flex justify-center">
            <div className="mt-2.5 h-[4px] w-[109px] rounded-full bg-[#3D3D3D]" />
          </div>

          {hasOptions ? (
            <>
              {options.map(opt => (
                <div key={opt.name} className="bg-white px-5 pt-3.5">
                  <OptionSelector
                    name={opt.name}
                    options={opt.values}
                    selectedOption={selectedOptions[opt.name]}
                    onSelect={value => handleOptionChange(opt.name, value)}
                  />
                </div>
              ))}

              {allOptionsSelected && (
                <ProductQuantitySelector
                  selectedOption={item.name} // 상품명을 selectedOption으로 전달
                  quantity={quantity}
                  onIncrease={() => setQuantity(prev => prev + 1)}
                  onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                  price={item.price}
                  originalPrice={originalPrice}
                  item={item}
                />
              )}
              {allOptionsSelected && (
                <TotalPrice
                  quantity={quantity}
                  price={item.price} // 할인된 금액으로 변경
                  originalPrice={originalPrice} // 원가 전달
                />
              )}
            </>
          ) : (
            <>
              <ProductQuantitySelector
                selectedOption={item.name} // 상품명을 selectedOption으로 전달
                quantity={quantity}
                onIncrease={() => setQuantity(prev => prev + 1)}
                onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                price={item.price}
                originalPrice={originalPrice}
                item={item}
              />
              <TotalPrice
                quantity={quantity}
                price={item.price} // 할인된 금액으로 변경
                originalPrice={originalPrice} // 원가 전달
              />
            </>
          )}

          {isReadyToAdd && (
            <div className="px-5 py-3">
              <button
                onClick={handleAddToCart}
                className="w-full rounded bg-pink-500 py-3 text-lg font-semibold text-white hover:bg-pink-600"
              >
                장바구니 담기
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
