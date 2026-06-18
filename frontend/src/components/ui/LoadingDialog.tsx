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
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-2xl shadow-2xl
            p-8 w-[320px]
            flex flex-col items-center gap-5
            z-50
          "
        >
          {/* Animated Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
          </div>

          <p className="text-sm text-dark-600 text-center font-medium">
            {message}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}