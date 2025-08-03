import { CartProvider } from '@/components/features/shop/ProductDetail/CartContext';
import Header from '@/components/layout/header/Header';
import TabBar from '@/components/layout/tabbar/Tabbar';
import { PropsWithChildren } from 'react';

export function MobileFrame({ children }: PropsWithChildren) {
  return (
    <CartProvider>
      <div
        id="modal-root"
        className="frame-guideline relative mx-auto flex min-h-screen w-full max-w-[600px] flex-col"
      >
        <Header />
        {children}
        <TabBar />
      </div>
    </CartProvider>
  );
}
