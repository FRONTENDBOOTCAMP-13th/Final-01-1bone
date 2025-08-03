import Modal, { ModalBackdrop, ModalPanel } from '@/components/common/Modal';
import { Separator } from '@/components/ui/separator';

interface ConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({ onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal key={'confitem-modal'} onClose={onClose}>
      <ModalBackdrop />

      <ModalPanel className="mx-6 w-[400px] px-6 py-4 text-center text-[#1A1A1A]">
        <div className="my-6 flex flex-col gap-2 text-center">
          <p className="">{`정말로 이 게시물을 삭제하시겠습니까?`}</p>
          <p className="text-sm text-gray-500">
            삭제된 게시물은 복구할 수 없습니다
          </p>
        </div>
        <div className="flex h-10 gap-2">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer py-2 font-medium"
          >
            아니요
          </button>
          <div className="flex h-full items-center justify-center py-3">
            <Separator orientation="vertical" className="bg-gray-300" />
          </div>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer py-2 font-medium"
          >
            네 삭제할래요
          </button>
        </div>
      </ModalPanel>
    </Modal>
  );
}
