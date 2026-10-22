"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { visibleRequestLimit } from "@/data/decision-requests";
import type { DashboardRequest } from "@/types/dashboard";

gsap.registerPlugin(useGSAP);

type ListSnapshot = {
  positions: Map<string, number>;
  height: number;
};

type UseAnimatedCardLayoutOptions = {
  requests: DashboardRequest[];
  showAll: boolean;
  onRemove: (id: number) => void;
};

export function useAnimatedCardLayout({ requests, showAll, onRemove }: UseAnimatedCardLayoutOptions) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listSnapshotRef = useRef<ListSnapshot | null>(null);
  const layoutTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingApprovalIdsRef = useRef(new Set<number>());
  const exitingRequestIdsRef = useRef(new Set<number>());
  const animationLockRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  function finishAnimation() {
    const hasPendingApprovals = pendingApprovalIdsRef.current.size > 0;
    animationLockRef.current = hasPendingApprovals;
    setIsAnimating(hasPendingApprovals);
    setIsToggling(false);
  }

  function captureLayout() {
    const list = listRef.current;
    const card = cardRef.current;
    if (!list || !card) return;

    // Retarget from the current visual layout when another exit finishes mid-animation.
    layoutTimelineRef.current?.kill();
    layoutTimelineRef.current = null;
    const listTop = list.getBoundingClientRect().top;
    const height = card.getBoundingClientRect().height;
    listSnapshotRef.current = {
      height,
      positions: new Map(Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li"), (row) => [row.dataset.requestId!, row.getBoundingClientRect().top - listTop])),
    };
    // Freeze the card before React changes its natural content size.
    gsap.set(card, { height });
  }

  const { contextSafe } = useGSAP(() => {
    const list = listRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const snapshot = listSnapshotRef.current;
    if (!list || !card || !content || !snapshot) return;
    listSnapshotRef.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(card, { clearProps: "height" });
      finishAnimation();
      return;
    }

    const rows = Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li"));
    // Snap to natural positions only for measurement; the snapshot restores the visual positions before paint.
    if (rows.length) gsap.set(rows, { y: 0 });
    const cardStyles = window.getComputedStyle(card);
    const cardInsets = [cardStyles.paddingTop, cardStyles.paddingBottom, cardStyles.borderTopWidth, cardStyles.borderBottomWidth]
      .reduce((total, value) => total + parseFloat(value), 0);
    // Measure natural content independently of the card's animated height.
    const nextHeight = content.getBoundingClientRect().height + cardInsets;
    const listTop = list.getBoundingClientRect().top;
    const timeline = gsap.timeline({
      defaults: { duration: 0.45, ease: "power3.inOut" },
      onComplete: () => {
        layoutTimelineRef.current = null;
        finishAnimation();
      },
    });
    layoutTimelineRef.current = timeline;

    timeline.fromTo(card, { height: snapshot.height }, { height: nextHeight, duration: 0.5 }, 0);
    let enteringIndex = 0;
    rows.forEach((row) => {
      const previousTop = snapshot.positions.get(row.dataset.requestId!);

      if (previousTop !== undefined) {
        // Invert the layout change, then slide the existing rows into place.
        timeline.fromTo(row, { y: previousTop - (row.getBoundingClientRect().top - listTop) }, { y: 0 }, 0);
        if (!exitingRequestIdsRef.current.has(Number(row.dataset.requestId)) && Number(gsap.getProperty(row, "opacity")) < 1) {
          // Continue revealing a queued row if an overlapping exit interrupted its entrance.
          timeline.to(row, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0);
        }
      } else {
        // Reveal newly expanded or queued rows in order as the card opens.
        timeline.fromTo(row, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1 + enteringIndex * 0.07);
        enteringIndex += 1;
      }
    });

    const emptyMessage = content.querySelector('[role="status"]');
    if (emptyMessage) {
      timeline.fromTo(emptyMessage, { opacity: 0, y: 8 }, { opacity: 1, y: 0, clearProps: "opacity,transform" }, 0.08);
    }
    timeline.set(card, { clearProps: "height" });
  }, { scope: cardRef, dependencies: [requests, showAll] });

  function startApproval(id: number) {
    pendingApprovalIdsRef.current.add(id);
    animationLockRef.current = true;
    setIsAnimating(true);
  }

  function toggleShowAll(onToggle: () => void) {
    if (animationLockRef.current) return;
    const list = listRef.current;
    if (!list || !cardRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onToggle();
      return;
    }

    animationLockRef.current = true;
    setIsAnimating(true);
    setIsToggling(true);
    contextSafe(() => {
      const commitToggle = () => {
        captureLayout();
        onToggle();
      };
      const exitingRows = showAll ? Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li")).slice(visibleRequestLimit) : [];

      if (exitingRows.length) {
        gsap.to(exitingRows, { opacity: 0, y: -8, duration: 0.16, stagger: 0.035, ease: "power2.in", onComplete: commitToggle });
      } else {
        commitToggle();
      }
    })();
  }

  function approveRequest(id: number) {
    if (exitingRequestIdsRef.current.has(id)) return;
    const list = listRef.current;
    const card = cardRef.current;
    const row = list?.querySelector<HTMLLIElement>(`[data-request-id="${id}"]`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!list || !card || !row || reducedMotion) {
      pendingApprovalIdsRef.current.delete(id);
      onRemove(id);
      finishAnimation();
      return;
    }

    startApproval(id);
    exitingRequestIdsRef.current.add(id);
    contextSafe(() => {
      // Row exits own opacity and child movement; layout reflow owns the row's position.
      gsap.killTweensOf(row, "opacity");
      gsap.timeline({
        defaults: { duration: 0.22, ease: "power2.in" },
        onComplete: () => {
          captureLayout();
          pendingApprovalIdsRef.current.delete(id);
          exitingRequestIdsRef.current.delete(id);
          onRemove(id);
        },
      })
        .to(row, { opacity: 0 }, 0)
        .to(Array.from(row.children), { y: -8 }, 0);
    })();
  }

  return { cardRef, contentRef, listRef, isAnimating, isToggling, startApproval, approveRequest, toggleShowAll };
}
