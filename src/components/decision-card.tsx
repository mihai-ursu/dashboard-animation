"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Request = {
  id: number;
  title: string;
  context: string;
  status: string;
  time: string;
  image: string;
  needsReview: boolean;
  detail: string;
};

const initialRequests: Request[] = [
  {
    id: 1,
    title: "Book an electrician for a $480 repair",
    context: "Maintenance agent · 38 Oak St, Unit 3",
    status: "Above spending limit",
    time: "14 min",
    image: "/avatars/house.jpg",
    needsReview: true,
    detail: "The kitchen outlets need a repair. The electrician quoted $480, which exceeds the property's automatic approval limit of $350.",
  },
  {
    id: 2,
    title: "Reply to Emma and arrange Friday’s viewing",
    context: "Leasing agent · 640 Park Ave, Unit 2B",
    status: "Within guidelines",
    time: "5 min",
    image: "/avatars/resident.jpg",
    needsReview: false,
    detail: "Confirm Emma's viewing for Friday at 2 pm and send the property access instructions.",
  },
  {
    id: 3,
    title: "Send Daniel Chen his October summary",
    context: "Owner agent · 3 properties, 18 units",
    status: "Within guidelines",
    time: "28 min",
    image: "/avatars/owner.jpg",
    needsReview: false,
    detail: "Send the monthly owner summary covering rental income, maintenance expenses, and occupancy across all three properties.",
  },
  {
    id: 4,
    title: "Renew the lease at the existing rate",
    context: "Leasing agent · Willow Court, Unit 8A",
    status: "Renewal decision",
    time: "1 h",
    image: "/avatars/apartments.jpg",
    needsReview: true,
    detail: "The current resident requested a 12-month renewal. Review the proposed renewal at the existing monthly rent.",
  },
  {
    id: 5,
    title: "Deliver a 48-hour inspection notice",
    context: "Maintenance agent · 52 Birch Rd, Unit 5",
    status: "Entry notice",
    time: "2 h",
    image: "/avatars/property.jpg",
    needsReview: true,
    detail: "Review the notice for the upcoming routine property inspection before it is delivered to the resident.",
  },
  {
    id: 6,
    title: "Confirm the courtyard landscaping visit",
    context: "Maintenance agent · Willow Court",
    status: "Within guidelines",
    time: "3 h",
    image: "/avatars/apartments.jpg",
    needsReview: false,
    detail: "Confirm the scheduled landscaping visit for the shared courtyard on Monday morning.",
  },
];

export function DecisionCard({ version }: { version: "Before" | "After" }) {
  // Each mounted version owns its count and queue independently.
  const [queue, setQueue] = useState({ count: 6, requests: initialRequests });
  const [showAll, setShowAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = `${version.toLowerCase()}-heading`;

  function approve(id: number) {
    setQueue((current) => {
      const requests = current.requests.filter((request) => request.id !== id);
      return { count: requests.length, requests };
    });
  }

  function review(request: Request) {
    setSelectedRequest(request);
    dialogRef.current?.showModal();
  }

  const visibleRequests = showAll ? queue.requests : queue.requests.slice(0, 5);

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <p className="mb-4 pl-1 text-[11px] font-semibold tracking-[0.18em] text-[#9393AA] uppercase">
        {version}
      </p>
      <div className="rounded-[28px] border border-[#EAE8F3] bg-white px-3 pt-6 pb-3 shadow-[0_2px_3px_0_rgba(30,22,60,0.025)] sm:px-4 sm:pt-6 sm:pb-4">
        <header className="mb-3 flex items-center justify-between gap-3 px-2 sm:px-3">
          <div>
            <h2 id={headingId} className="flex items-center gap-2 text-[15px] leading-5 font-semibold tracking-[-0.2px] text-[#191635]">
              Ready for your approval
              <span aria-label={`${queue.count} pending requests`} aria-live="polite" className="flex h-[21px] min-w-[23px] items-center justify-center rounded-full bg-[#F0EAFF] px-1.5 text-[13px] font-normal text-[#6544D8]">
                {queue.count}
              </span>
            </h2>
            <p className="mt-0.5 text-xs leading-[18px] text-[#9290AA]">
              Prioritized for you. Every action waits for your go-ahead.
            </p>
          </div>
          <button type="button" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg py-2 text-xs text-[#5032BB] transition-colors hover:text-[#8059E9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8059E9]">
            {showAll ? "Show less" : `View all ${queue.count}`}
            <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-3 transition-transform ${showAll ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="m6 3 5 5-5 5" />
            </svg>
          </button>
        </header>
        <ul className="space-y-0.5">
          {visibleRequests.map((request) => (
            <li key={request.id} className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-[20px] px-2 py-2 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-x-3.5 sm:px-3 sm:py-[7px] ${request.id === 2 ? "bg-[#F7F5FC]" : ""}`}>
              <Image src={request.image} alt="" width={44} height={44} className="size-10 rounded-[15px] object-cover sm:size-11" />
              <div className="min-w-0">
                <p className="text-[13px] leading-5 font-medium text-[#191635] xl:text-sm">{request.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-[18px]">
                  <span className="text-[#625C80]">{request.context}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 whitespace-nowrap ${request.needsReview ? "bg-[#FFF3C5] text-[#A4530C]" : "bg-[#DAFCE7] text-[#168246]"}`}>
                    <span className={`size-1.5 rounded-full ${request.needsReview ? "bg-[#F6A009]" : "bg-[#21AC60]"}`} />
                    {request.status}
                  </span>
                </div>
              </div>
              <div className="col-start-2 flex items-center justify-end gap-3 sm:col-start-auto sm:gap-3.5">
                <span className="text-xs whitespace-nowrap text-[#9692AD]">{request.time}</span>
                <button type="button" aria-label={`${request.needsReview ? "Review" : "Approve"}: ${request.title}`} onClick={() => request.needsReview ? review(request) : approve(request.id)} className={`h-[35px] w-[88px] shrink-0 cursor-pointer rounded-full border text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8059E9] xl:w-[94px] ${request.needsReview ? "border-[#EAE7F3] bg-white text-[#191635] hover:border-[#BBA5EF] hover:bg-[#F7F5FC]" : "border-[#815BE8] bg-[#815BE8] text-white hover:border-[#7048D6] hover:bg-[#7048D6]"}`}>
                  {request.needsReview ? "Review" : "Approve"}
                </button>
              </div>
            </li>
          ))}
        </ul>
        {queue.count === 0 && <p role="status" className="px-3 py-14 text-center text-sm text-[#625C80]">You’re all caught up. No approvals waiting.</p>}
      </div>
      <dialog ref={dialogRef} aria-labelledby={`${headingId}-review`} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-[24px] border border-[#EAE8F3] bg-white p-6 text-[#191635] shadow-xl backdrop:bg-[#191635]/25">
        <h3 id={`${headingId}-review`} className="text-lg font-semibold">{selectedRequest?.title}</h3>
        <p className="mt-2 text-xs text-[#9290AA]">{selectedRequest?.context}</p>
        <p className="mt-4 text-sm leading-6 text-[#625C80]">{selectedRequest?.detail}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => dialogRef.current?.close()} className="cursor-pointer rounded-full border border-[#EAE7F3] px-4 py-2 text-sm hover:bg-[#F7F5FC] focus-visible:outline-2 focus-visible:outline-[#8059E9]">Close</button>
          <button type="button" onClick={() => { if (selectedRequest) approve(selectedRequest.id); dialogRef.current?.close(); }} className="cursor-pointer rounded-full bg-[#815BE8] px-4 py-2 text-sm text-white hover:bg-[#7048D6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8059E9]">Approve request</button>
        </div>
      </dialog>
    </section>
  );
}
