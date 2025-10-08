import * as Dialog from "@radix-ui/react-dialog";

export function SuccessDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <Dialog.Content
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
          bg-white rounded-lg shadow-lg p-6 w-[300px] text-center"
        >
          <Dialog.Title className="text-lg font-semibold text-green-700 mb-2">✅ Success</Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-4">
            Your service request was submitted successfully.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
