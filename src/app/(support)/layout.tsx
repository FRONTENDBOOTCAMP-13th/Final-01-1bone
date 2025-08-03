import { GithubIcon, InstaIcon, YoutubeIcon } from '@/components/common/icons';
import Link from 'next/link';

export default function ServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100%-56px-48px)] w-full flex-1 flex-col">
      {children}
      <div className="flex flex-1 flex-col gap-3 bg-gray-50 px-8 py-10">
        <ul className="flex items-center gap-2">
          <li className="flex">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full bg-[#D9D9D9]"
            >
              <GithubIcon />
            </Link>
          </li>
          <li className="flex">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full bg-[#D9D9D9]"
            >
              <YoutubeIcon />
            </Link>
          </li>
          <li className="flex">
            <Link
              href="/"
              className="flex size-10 items-center justify-center rounded-full bg-[#D9D9D9]"
            >
              <InstaIcon />
            </Link>
          </li>
        </ul>
        <p className="text-xs text-[#666666]">© Hobbism All rights reserved</p>
      </div>
    </div>
  );
}
