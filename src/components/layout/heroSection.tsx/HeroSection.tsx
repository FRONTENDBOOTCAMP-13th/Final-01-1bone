import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <aside className="fixed">
      <div className="relative hidden h-screen items-center justify-center bg-white xl:flex">
        <div className="relative left-60 2xl:left-80">
          <Image src="/new_logo.png" alt="logo" width={230} height={230} />
          <p className="text-center text-xl">당신의 취미를 찾아보세요.</p>
          <Image
            src="/perfume.png"
            alt="perfume"
            width={80}
            height={80}
            className="relative right-5 bottom-47 -rotate-10"
          />
          <Image
            src="/coffee.png"
            alt="coffee"
            width={80}
            height={80}
            className="relative bottom-50 left-60 rotate-20"
          />
          <Image
            src="/run.png"
            alt="running"
            width={70}
            height={70}
            className="relative right-22 bottom-60 rotate-30"
          />
          <Image
            src="/shirts.png"
            alt="shirts"
            width={70}
            height={70}
            className="relative bottom-55 left-45 -rotate-10"
          />
          {/* QR Code */}
          <div className="absolute bottom-25 rounded-3xl border-4 border-[#68696E] p-2">
            <Image
              src="/qr.jpg"
              alt="qr-code"
              width={150}
              height={150}
              className=""
            />
          </div>
        </div>
        <Image
          src="/bear.png"
          alt="logo"
          width={250}
          height={250}
          className="relative top-80 right-57"
        />
        <Image
          src="/bear.png"
          alt="logo"
          width={250}
          height={250}
          className="relative right-5 bottom-100 rotate-170 2xl:bottom-106 2xl:left-50"
        />
      </div>
      {/* footer */}
      <footer className="absolute bottom-8 left-110 hidden flex-col xl:flex">
        <div className="mb-2 flex gap-x-3">
          <Link
            href="https://github.com/FRONTENDBOOTCAMP-13th/Final-01-1bone"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Image
              src="/github.svg"
              alt="github-icon"
              width={25}
              height={25}
              className="opacity-60 grayscale"
            />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Image
              src="/youtube.svg"
              alt="youtube-icon"
              width={25}
              height={25}
              className="opacity-60 grayscale"
            />
          </Link>
        </div>
        <div className="mb-2 text-xs text-gray-600">
          <span className="font-semibold">팀원 소개</span>
          <ul className="mt-1 flex flex-col items-center gap-1">
            <li>길인환, 김현지, 우영찬, 이우민, 장아영</li>
          </ul>
        </div>
        <span className="text-xs text-gray-400">
          © 2025 Hobbism. All rights reserved.
        </span>
      </footer>
    </aside>
  );
}
