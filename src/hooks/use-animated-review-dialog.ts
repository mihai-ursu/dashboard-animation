"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { DashboardRequest } from "@/types/dashboard";

gsap.registerPlugin(useGSAP);

const openingDuration = 0.7;

// A unit-mass spring with stiffness 150 and damping 25, matching the reference.
function springProgress(time: number) {
  return 1 - 3 * Math.exp(-10 * time) + 2 * Math.exp(-15 * time);
}

function openingEase(progress: number) {
  return springProgress(progress * openingDuration) / springProgress(openingDuration);
}

type UseAnimatedReviewDialogOptions = {
  request: DashboardRequest | null;
  onClose: () => void;
  onApprove: () => void;
};

export function useAnimatedReviewDialog({ request, onClose, onApprove }: UseAnimatedReviewDialogOptions) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);

  const { contextSafe, context } = useGSAP(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!request || !dialog || !panel || !backdrop) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closingRef.current = false;

    gsap.set(panel, {
      transformPerspective: 500,
      transformOrigin: "50% 50%",
      rotationX: reducedMotion ? 0 : -20,
      scale: reducedMotion ? 1 : 0.8,
      opacity: 0,
      filter: "blur(4px)",
    });
    gsap.set(backdrop, { backgroundColor: "rgba(25, 22, 53, 0)", backdropFilter: "blur(0px)" });
    // Open after React has committed the selected request, before the first paint.
    dialog.showModal();

    timelineRef.current = gsap.timeline()
      .to(panel, { rotationX: 0, scale: 1, duration: reducedMotion ? 0 : openingDuration, ease: openingEase }, 0)
      .to(panel, { opacity: 1, filter: "blur(0px)", duration: reducedMotion ? 0.12 : 0.4, ease: "power3.out" }, 0)
      // Animate the blur itself so the background softens progressively.
      .to(backdrop, { backgroundColor: "rgba(25, 22, 53, 0.18)", backdropFilter: "blur(4px)", duration: reducedMotion ? 0.12 : 0.4, ease: "power3.out" }, 0);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      dialog.close();
    };
  }, { scope: dialogRef, dependencies: [request], revertOnUpdate: true });

  function dismiss(approve = false) {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!dialog?.open || !panel || !backdrop || closingRef.current) return;

    closingRef.current = true;
    timelineRef.current?.kill();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    contextSafe(() => {
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          timelineRef.current = null;
          dialog.close();
          // The list exit belongs to the card's GSAP context, not the dialog's.
          context.ignore(approve ? onApprove : onClose);
        },
      })
        .to(panel, {
          rotationX: reducedMotion ? 0 : -20,
          scale: reducedMotion ? 1 : 0.8,
          opacity: 0,
          filter: "blur(4px)",
          duration: reducedMotion ? 0.12 : 0.2,
          ease: (progress: number) => 0.5 * progress + 0.5 * progress * progress,
        }, 0)
        .to(backdrop, { backgroundColor: "rgba(25, 22, 53, 0)", backdropFilter: "blur(0px)", duration: reducedMotion ? 0.12 : 0.4, ease: "power3.out" }, 0);
    })();
  }

  return {
    dialogRef,
    panelRef,
    backdropRef,
    closeReview: () => dismiss(),
    approveRequest: () => dismiss(true),
  };
}
