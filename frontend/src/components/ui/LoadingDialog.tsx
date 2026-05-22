// components/ui/LoadingDialog.tsx

import * as Dialog from "@radix-ui/react-dialog";

type Props = {
  open: boolean;
  message?: string;
};

export default function LoadingDialog({
  open,
  message = "Processing...",
}: Props) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-xl shadow-xl
            p-6 w-[300px]
            flex flex-col items-center gap-4
            z-50
          "
        >
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

          <p className="text-sm text-gray-600 text-center">
            {message}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}