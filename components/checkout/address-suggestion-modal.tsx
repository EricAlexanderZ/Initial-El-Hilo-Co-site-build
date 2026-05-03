"use client";

type AddressBlock = {
  name: string;
  line1: string;
  line2: string;
  country: string;
};

type AddressSuggestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUseOriginal: () => void;
  onUseSuggested: () => void;
  original: AddressBlock;
  suggested: AddressBlock;
};

export default function AddressSuggestionModal({
  isOpen,
  onClose,
  onUseOriginal,
  onUseSuggested,
  original,
  suggested,
}: AddressSuggestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-3xl rounded-[1.5rem] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-3xl font-bold">Address Suggestion</h3>
            <p className="mt-3 text-sm text-gray-500">
              We have a suggestion for your shipping address. Please review it before continuing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f3f3f2] p-5">
            <p className="mb-4 text-sm font-semibold">Your Address:</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{original.name}</p>
              <p>{original.line1}</p>
              <p>{original.line2}</p>
              <p>{original.country}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#9fc2ff] bg-[#eef4ff] p-5">
            <p className="mb-4 text-sm font-semibold">Suggested Address:</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{suggested.name}</p>
              <p>{suggested.line1}</p>
              <p>{suggested.line2}</p>
              <p>{suggested.country}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onUseOriginal}
            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold"
          >
            Use My Address
          </button>

          <button
            type="button"
            onClick={onUseSuggested}
            className="rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black"
          >
            Use Suggested Address
          </button>
        </div>
      </div>
    </div>
  );
}