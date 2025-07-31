import { X } from 'lucide-react';

interface CommentHeaderProps {
  onClose: () => void;
}

export default function CommentHeader({ onClose }: CommentHeaderProps) {
  return (
    <div className="relative flex items-center justify-center border-b border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900">댓글</h3>
      <button
        onClick={onClose}
        className="absolute right-4 rounded-full p-2 transition-colors hover:bg-gray-100"
      >
        <X size={20} className="text-gray-500" />
      </button>
    </div>
  );
}
