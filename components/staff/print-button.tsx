"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => globalThis.print()} className="print-hidden mb-6 rounded-full bg-[#583d2f] px-5 py-2 text-sm font-semibold text-white">
      Print Receipt
    </button>
  );
}
