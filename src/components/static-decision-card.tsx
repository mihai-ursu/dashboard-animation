"use client";

import Image from "next/image";
import { useStaticDecisionCard } from "@/hooks/use-static-decision-card";
import { dashboardCopy, visibleRequestLimit } from "@/data/decision-requests";

export function StaticDecisionCard() {
  const {
    dialogRef,
    count,
    showAll,
    selectedRequest,
    headingId,
    visibleRequests,
    closeReview,
    approveSelectedRequest,
    toggleShowAll,
  } = useStaticDecisionCard();

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <p className="mb-4 pl-1 text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
        {dashboardCopy.before}
      </p>
      <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white px-3 pt-6 pb-3 shadow-[0_2px_3px_0_rgba(15,23,42,0.025)] sm:px-4 sm:pt-6 sm:pb-4">
        <div className="flow-root">
          <header className="mb-3 flex items-center justify-between gap-3 px-2 sm:px-3">
            <div>
              <h2 id={headingId} className="flex items-center gap-2 text-[15px] leading-5 font-semibold tracking-[-0.2px] text-slate-900">
                {dashboardCopy.heading}
                <span aria-label={`${count} ${dashboardCopy.pendingRequests}`} aria-live="polite" className="flex h-[21px] min-w-[23px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-[13px] font-normal text-blue-600">
                  {count}
                </span>
              </h2>
              <p className="mt-0.5 text-xs leading-[18px] text-slate-400">
                {dashboardCopy.description}
              </p>
            </div>
            {count > visibleRequestLimit && (
              <button type="button" onClick={toggleShowAll} aria-expanded={showAll} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg py-2 text-xs text-blue-700 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
                {showAll ? dashboardCopy.showLess : `${dashboardCopy.viewAll} ${count}`}
                <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-3  ${showAll ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="m6 3 5 5-5 5" />
                </svg>
              </button>
            )}
          </header>
          <ul className="space-y-0.5">
            {visibleRequests.map((request) => (
              <li key={request.id} data-request-id={request.id} className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[20px] px-2 py-2 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-x-3.5 sm:px-3 sm:py-[7px] ${request.id === 2 ? "bg-blue-50" : ""}`}>
                <Image src={request.image} alt="" width={44} height={44} className="size-10 rounded-[15px] object-cover sm:size-11" />
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
                    <button type="button" aria-label={`${dashboardCopy.review}: ${request.title}`} onClick={request.onReview} className="h-[35px] w-[88px] shrink-0 cursor-pointer rounded-full border border-blue-100 bg-white text-[13px] font-medium text-slate-900 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:w-[94px]">
                      {dashboardCopy.review}
                    </button>
                  ) : (
                    <button type="button" aria-label={`${dashboardCopy.approve}: ${request.title}`} onClick={request.onApprove} className="grid h-[35px] w-[88px] shrink-0 cursor-pointer place-items-center rounded-full bg-blue-500 text-[13px] font-medium text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:w-[94px]">
                      {dashboardCopy.approve}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {count === 0 && <p role="status" className="px-3 py-14 text-center text-sm text-slate-600">{dashboardCopy.emptyMessage}</p>}
        </div>
      </div>
      <dialog ref={dialogRef} aria-labelledby={`${headingId}-review`} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[24px] border border-blue-100 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/25">
        <h3 id={`${headingId}-review`} className="text-lg font-semibold">{selectedRequest?.title}</h3>
        <p className="mt-2 text-xs text-slate-400">{selectedRequest?.context}</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">{selectedRequest?.detail}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={closeReview} className="cursor-pointer rounded-full border border-blue-100 px-4 py-2 text-sm hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500">{dashboardCopy.close}</button>
          <button type="button" onClick={approveSelectedRequest} className="cursor-pointer rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">{dashboardCopy.approveRequest}</button>
        </div>
      </dialog>
    </section>
  );
}
