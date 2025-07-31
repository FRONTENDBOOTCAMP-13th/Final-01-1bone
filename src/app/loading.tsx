import { PulseLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex h-[calc(100%-48px-55px)] flex-col items-center justify-center">
      <PulseLoader color="#4A4A4A" />
    </div>
  );
}
