import { PulseLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <PulseLoader color="#4A4A4A" />
    </div>
  );
}
