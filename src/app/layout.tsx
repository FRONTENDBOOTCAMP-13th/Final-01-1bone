'use client';

import '@/styles/globals.css';
import localFont from 'next/font/local';
import { MobileFrame } from '@/components/layout/moblie-frame/MobileFrame';
import ModalProvider from '@/components/common/ModalProvider';
import { SessionProvider } from 'next-auth/react';
import TokenSync from '@/components/features/auth/TokenSync';
import Script from 'next/script';
import AdBannerModal from '@/components/features/user/alarm/AdBannerModal';
import { ToastProvider } from '@/components/common/ToastProvider';
import HeroSection from '@/components/layout/heroSection.tsx/HeroSection';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${pretendard.className}`}>
        <SessionProvider>
          <div className="flex">
            <TokenSync />
            <HeroSection />
            <MobileFrame>
              {children}
              <AdBannerModal />
              <ModalProvider />
              <ToastProvider />
            </MobileFrame>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
