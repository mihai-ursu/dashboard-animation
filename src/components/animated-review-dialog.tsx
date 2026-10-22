"use client";

import { useAnimatedReviewDialog } from "@/hooks/use-animated-review-dialog";
import { dashboardCopy } from "@/data/decision-requests";
import type { DashboardRequest } from "@/types/dashboard";

type AnimatedReviewDialogProps = {
  request: DashboardRequest | null;
  headingId: string;
  onClose: () => void;
  onApprove: () => void;
};

export function AnimatedReviewDialog({ request, headingId, onClose, onApprove }: AnimatedReviewDialogProps) {
  const { dialogRef, panelRef, backdropRef, closeReview, approveRequest } = useAnimatedReviewDialog({ request, onClose, onApprove });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${headingId}-review`}
      aria-describedby={`${headingId}-review-detail`}
      onCancel={(event) => {
        event.preventDefault();
        closeReview();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-transparent p-0 text-slate-900 backdrop:bg-transparent"
    >
      <div ref={backdropRef} aria-hidden="true" className="pointer-events-none fixed inset-0" />
      <div
        className="relative grid min-h-full place-items-center p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeReview();
        }}
      >
        <div ref={panelRef} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[24px] border border-blue-100 bg-white p-6 shadow-xl">
          <h3 id={`${headingId}-review`} className="text-lg font-semibold">{request?.title}</h3>
          <p className="mt-2 text-xs text-slate-400">{request?.context}</p>
          <p id={`${headingId}-review-detail`} className="mt-4 text-sm leading-6 text-slate-600">{request?.detail}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={closeReview} className="cursor-pointer rounded-full border border-blue-100 px-4 py-2 text-sm hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500">{dashboardCopy.close}</button>
            <button type="button" onClick={approveRequest} className="cursor-pointer rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">{dashboardCopy.approveRequest}</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
