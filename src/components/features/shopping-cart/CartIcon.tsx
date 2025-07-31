// 'use client';

// import { useCartStore } from '@/store/cart.store';
// import { ShoppingCart } from 'lucide-react';

// export default function CartIcon() {
//   const totalItems = useCartStore(state => state.getTotalItems());

//   return (
//     <div className="relative">
//       <ShoppingCart />
//       {totalItems > 0 && (
//         <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
//           {totalItems}
//         </span>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useCart } from '@/components/features/shop/ProductDetail/CartContext';
// import { ShoppingCart } from 'lucide-react';

// export default function CartIcon() {
//   const { cartCount } = useCart(); // CartContext에서 cartCount 가져오기

//   return (
//     <div className="relative">
//       <ShoppingCart className="h-6 w-6 text-gray-700" />
//       {cartCount > 0 && (
//         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//           {cartCount}
//         </span>
//       )}
//     </div>
//   );
// }

'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function CartIcon() {
  const { cartCount } = useCart(); // useCart에서 cartCount 가져오기

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {cartCount}
        </span>
      )}
    </div>
  );
}
