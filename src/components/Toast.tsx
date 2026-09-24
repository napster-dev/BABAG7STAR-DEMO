"use client";

import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/StoreContext";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] animate-fadeUp">
      <div className="flex items-center gap-2.5 bg-[#141414] border border-[#F5C542]/40 rounded-full pl-4 pr-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,.7),0_0_24px_rgba(245,197,66,.25)] text-sm font-semibold whitespace-nowrap max-w-[92vw] overflow-hidden">
        <CheckCircle2 size={18} className="text-[#F5C542] shrink-0" />
        <span className="truncate">{toast}</span>
      </div>
    </div>
  );
}
