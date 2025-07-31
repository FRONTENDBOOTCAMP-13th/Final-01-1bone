'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <span className="relative top-10 flex animate-bounce items-center gap-2 text-[80px] font-extrabold text-black">
        4
        <Image
          src="/clock.png"
          alt=""
          width={60}
          height={60}
          className="spin-slow"
        />
        4
      </span>
      <span className="pointer-events-none pb-10 text-3xl font-black text-black opacity-50">
        Ooops!
      </span>
      <p className="mb-5 text-2xl font-bold text-gray-700">
        페이지를 찾을 수 없습니다
      </p>
      <p className="mb-8 text-center text-gray-500">
        요청하신 페이지가 존재하지 않거나, <br /> 이동 또는 삭제되었습니다.
      </p>
      <Link
        href="/"
        className="rounded-3xl bg-[#FE508B] px-20 py-3 font-bold text-white shadow-md hover:bg-[#E6477B]"
      >
        홈으로
      </Link>
    </div>
  );
}
