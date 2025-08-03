import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
interface ModalProps extends PropsWithChildren {
  onClose?: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const target =
    typeof window !== 'undefined'
      ? document.getElementById('modal-root')
      : null;

  if (!target) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 h-full w-full"
      role="dialog"
      onClick={onClose}
    >
      {children}
    </div>,
    target,
  );
}

export function ModalBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 mx-auto h-full w-full max-w-[600px] bg-[rgba(1,1,1,0.2)]',
        className,
      )}
    />
  );
}

export function ModalPanel({
  children,
  className,
  disableStopPropagation = false,
}: PropsWithChildren<{
  className?: string;
  disableStopPropagation?: boolean;
}>) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      <div
        onClick={e => {
          if (!disableStopPropagation) {
            e.stopPropagation(); // 평소엔 막음
          }
        }}
        className={cn(
          'relative max-w-[600px] rounded-2xl border border-[#D9D9D9] bg-white',
          className,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
