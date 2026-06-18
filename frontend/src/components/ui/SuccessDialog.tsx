// components/ui/SuccessDialog.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
};

export default function SuccessDialog({
  open,
  onOpenChange,
  title = "Success",
  message,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />

        <Dialog.Content
          className="
            fixed top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-2xl shadow-2xl
            p-8 w-[380px]
            text-center
            z-50
            animate-in fade-in zoom-in duration-200
          "
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500" size={56} strokeWidth={1.5} />
          </div>

          <Dialog.Title className="text-xl font-bold text-dark-200">
            {title}
          </Dialog.Title>

          <Dialog.Description className="text-dark-600 mt-3 whitespace-pre-line leading-relaxed">
            {message}
          </Dialog.Description>

          <button
            onClick={() => onOpenChange(false)}
            className="
              mt-6 px-6 py-2.5 rounded-xl
              bg-primary-700 text-white
              hover:bg-primary-800
              transition shadow-md hover:shadow-lg
              font-medium
            "
          >
            OK
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}