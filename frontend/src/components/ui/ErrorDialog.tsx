// components/ui/ErrorDialog.tsx

import * as Dialog from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
};

export default function ErrorDialog({
  open,
  onOpenChange,
  message,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-xl shadow-xl
            p-6 w-[350px]
            text-center
            z-50
          "
        >
          <div className="text-5xl mb-3">
            ❌
          </div>

          <Dialog.Title className="text-xl font-bold text-red-700">
            Error
          </Dialog.Title>

          <Dialog.Description className="text-gray-600 mt-2 whitespace-pre-line">
            {message}
          </Dialog.Description>

          <button
            onClick={() => onOpenChange(false)}
            className="
              mt-5 px-4 py-2 rounded-md
              bg-red-600 text-white
              hover:bg-red-700
            "
          >
            Close
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}