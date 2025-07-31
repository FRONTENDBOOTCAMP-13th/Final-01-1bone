import React from 'react';

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-end bg-black">
      <div className="w-full rounded-t-lg bg-white p-4">
        <button className="mb-4 text-right text-gray-500" onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    </div>
  );
};
