"use client";

import { useRef, useState } from "react";
import { initialRequests } from "@/data/decision-requests";
import { useAnimatedCardLayout } from "@/hooks/use-animated-card-layout";
import type { DashboardRequest } from "@/types/dashboard";

export function useAnimatedDecisionCard() {
  const [queue, setQueue] = useState({ count: initialRequests.length, requests: [...initialRequests] });
  const [showAll, setShowAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DashboardRequest | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = "after-heading";

  function removeRequest(id: number) {
    setQueue((current) => {
      const requests = current.requests.filter((request) => request.id !== id);
      return { count: requests.length, requests };
    });
  }

  const animations = useAnimatedCardLayout({
    requests: queue.requests,
    onRemove: removeRequest,
  });

  function reviewRequest(request: DashboardRequest) {
    setSelectedRequest(request);
    dialogRef.current?.showModal();
  }

  function closeReview() {
    dialogRef.current?.close();
  }

  function approveSelectedRequest() {
    if (selectedRequest) animations.approveRequest(selectedRequest.id);
    closeReview();
  }

  function toggleShowAll() {
    setShowAll((current) => !current);
  }

  const visibleRequests = (showAll ? queue.requests : queue.requests.slice(0, 5)).map((request) => ({
    ...request,
    onReview: () => reviewRequest(request),
    onApprove: () => animations.approveRequest(request.id),
  }));

  return {
    cardRef: animations.cardRef,
    contentRef: animations.contentRef,
    listRef: animations.listRef,
    isAnimating: animations.isAnimating,
    startApproval: animations.startApproval,
    dialogRef,
    count: queue.count,
    showAll,
    selectedRequest,
    headingId,
    visibleRequests,
    closeReview,
    approveSelectedRequest,
    toggleShowAll,
  };
}
