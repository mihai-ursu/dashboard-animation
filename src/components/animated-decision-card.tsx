"use client";

import Image from "next/image";
import { AnimatedApprovalButton } from "@/components/animated-approval-button";
import { AnimatedCount } from "@/components/animated-count";
import { AnimatedReviewDialog } from "@/components/animated-review-dialog";
import { useAnimatedDecisionCard } from "@/hooks/use-animated-decision-card";
import { dashboardCopy, visibleRequestLimit } from "@/data/decision-requests";

export function AnimatedDecisionCard() {
  const {
    cardRef,
    contentRef,
    listRef,
    count,
    showAll,
    selectedRequest,
    isAnimating,
    isToggling,
    headingId,
    visibleRequests,
    closeReview,
    approveSelectedRequest,
    toggleShowAll,
  } = useAnimatedDecisionCard();

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <p className="mb-4 pl-1 text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
        {dashboardCopy.after}
      </p>
      <div ref={cardRef} className="overflow-hidden rounded-[28px] border border-blue-100 bg-white px-3 pt-6 pb-3 shadow-[0_2px_3px_0_rgba(15,23,42,0.025)] sm:px-4 sm:pt-6 sm:pb-4">
        <div ref={contentRef} className="flow-root">
          <header className="mb-3 flex items-center justify-between gap-3 px-2 sm:px-3">
            <div>
              <h2 id={headingId} className="flex items-center gap-2 text-[15px] leading-5 font-semibold tracking-[-0.2px] text-slate-900">
                {dashboardCopy.heading}
                <span aria-label={`${count} ${dashboardCopy.pendingRequests}`} aria-live="polite" className="flex h-[21px] min-w-[23px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-[13px] font-normal text-blue-600">
                  <span className="sr-only">{count}</span>
                  <AnimatedCount value={count} />
                </span>
              </h2>
              <p className="mt-0.5 text-xs leading-[18px] text-slate-400">
                {dashboardCopy.description}
              </p>
            </div>
            {count > visibleRequestLimit && (
              <button type="button" disabled={isAnimating} onClick={toggleShowAll} aria-label={showAll ? dashboardCopy.showLess : `${dashboardCopy.viewAll} ${count}`} aria-expanded={showAll} aria-controls={`${headingId}-requests`} className="grid shrink-0 cursor-pointer grid-cols-[1fr_12px] items-center gap-x-1 rounded-lg py-2 text-xs text-blue-700 transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 disabled:cursor-default">
                <span aria-hidden="true" className={`col-start-1 row-start-1 flex items-center gap-1 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${showAll ? "-translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
                  {dashboardCopy.viewAll} <AnimatedCount value={count} />
                </span>
                <span aria-hidden="true" className={`col-start-1 row-start-1 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${showAll ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>{dashboardCopy.showLess}</span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className={`col-start-2 row-start-1 size-3 transition-transform duration-500 motion-reduce:transition-none ${showAll ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="m6 3 5 5-5 5" />
                </svg>
              </button>
            )}
          </header>
          <ul ref={listRef} id={`${headingId}-requests`} className="space-y-0.5">
            {visibleRequests.map((request) => (
              <li key={request.id} data-request-id={request.id} className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[20px] px-2 py-2 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-x-3.5 sm:px-3 sm:py-[7px] ${request.id === 2 ? "bg-blue-50" : ""}`}>
                <Image
                  src={request.image}
                  alt=""
                  width={44}
                  height={44}
                  loading="eager"
                  fetchPriority="high"
                  unoptimized
                  className="size-10 rounded-[15px] object-cover sm:size-11"
                />
                <div className="min-w-0">
                  <p className="text-[13px] leading-5 font-medium text-slate-900 xl:text-sm">{request.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-[18px]">
                    <span className="text-slate-600">{request.context}</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 whitespace-nowrap ${request.needsReview ? "bg-[#FFF3C5] text-[#A4530C]" : "bg-[#DAFCE7] text-[#168246]"}`}>
                      <span className={`size-1.5 rounded-full ${request.needsReview ? "bg-[#F6A009]" : "bg-[#21AC60]"}`} />
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="col-start-2 flex items-center justify-end gap-3 sm:col-start-auto sm:gap-3.5">
                  <span className="text-xs whitespace-nowrap text-slate-400">{request.time}</span>
                  {request.needsReview ? (
                    <button type="button" disabled={isAnimating} aria-label={`${dashboardCopy.review}: ${request.title}`} onClick={request.onReview} className="h-[35px] w-[88px] shrink-0 cursor-pointer rounded-full border border-blue-100 bg-white text-[13px] font-medium text-slate-900 transition-colors hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-default xl:w-[94px]">
                      {dashboardCopy.review}
                    </button>
                  ) : (
                    <AnimatedApprovalButton title={request.title} disabled={isToggling} onStart={request.onStart} onApprove={request.onApprove} />
                  )}
                </div>
              </li>
            ))}
          </ul>
          {count === 0 && <p role="status" className="px-3 py-14 text-center text-sm text-slate-600">{dashboardCopy.emptyMessage}</p>}
        </div>
      </div>
      <AnimatedReviewDialog request={selectedRequest} headingId={headingId} onClose={closeReview} onApprove={approveSelectedRequest} />
    </section>
  );
}
