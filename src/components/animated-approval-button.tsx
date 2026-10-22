"use client";

import { Check } from "lucide-react";
import { dashboardCopy } from "@/data/decision-requests";
import { useAnimatedApprovalButton } from "@/hooks/use-animated-approval-button";

type AnimatedApprovalButtonProps = {
  title: string;
  onApprove: () => void;
  onStart: () => void;
  disabled?: boolean;
};

export function AnimatedApprovalButton({ title, onApprove, onStart, disabled = false }: AnimatedApprovalButtonProps) {
  const { buttonRef, isDone, handleApprove } = useAnimatedApprovalButton({ onApprove, onStart });

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={isDone || disabled}
      aria-label={`${isDone ? dashboardCopy.done : dashboardCopy.approve}: ${title}`}
      onClick={handleApprove}
      className={`relative grid h-[35px] w-[88px] shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full text-[13px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default xl:w-[94px] ${isDone ? "bg-[#16A34A] focus-visible:outline-[#16A34A]" : "bg-[#815BE8] hover:bg-[#7048D6] focus-visible:outline-[#8059E9]"}`}
    >
      <span data-approval-label aria-hidden="true" className={`relative col-start-1 row-start-1 ${isDone ? "opacity-0" : "opacity-100"}`}>{dashboardCopy.approve}</span>
      <span data-done-label aria-hidden="true" className={`relative col-start-1 row-start-1 flex items-center gap-1.5 ${isDone ? "opacity-100" : "translate-y-1.5 opacity-0"}`}>
        <Check data-done-check className="size-3.5" strokeWidth={2.5} />
        {dashboardCopy.done}
      </span>
    </button>
  );
}
