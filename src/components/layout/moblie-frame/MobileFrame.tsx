import { CartProvider } from '@/components/features/shop/ProductDetail/CartContext';
import Header from '@/components/layout/header/Header';
import TabBar from '@/components/layout/tabbar/Tabbar';
import { PropsWithChildren } from 'react';

export function MobileFrame({ children }: PropsWithChildren) {
  return (
    <CartProvider>
      <div className="frame-guideline relative mx-auto h-screen w-full max-w-[600px]">
        <div className="xl:translate-x-[300px]">
          <Header />
          {children}
        </div>

        <div className="fixed bottom-0 w-full xl:translate-x-[300px]">
          <TabBar />
        </div>
      </div>
    </CartProvider>
  );
}
