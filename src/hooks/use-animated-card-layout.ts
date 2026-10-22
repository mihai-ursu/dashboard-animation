"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import type { DashboardRequest } from "@/types/dashboard";

gsap.registerPlugin(useGSAP);

type ListSnapshot = {
  positions: Map<string, number>;
  height: number;
};

type UseAnimatedCardLayoutOptions = {
  requests: DashboardRequest[];
  onRemove: (id: number) => void;
};

export function useAnimatedCardLayout({ requests, onRemove }: UseAnimatedCardLayoutOptions) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listSnapshotRef = useRef<ListSnapshot | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { contextSafe } = useGSAP(() => {
    const list = listRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const snapshot = listSnapshotRef.current;
    if (!list || !card || !content || !snapshot) return;
    listSnapshotRef.current = null;

    const rows = Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li"));
    const cardStyles = window.getComputedStyle(card);
    const cardInsets = [cardStyles.paddingTop, cardStyles.paddingBottom, cardStyles.borderTopWidth, cardStyles.borderBottomWidth]
      .reduce((total, value) => total + parseFloat(value), 0);
    // Measure natural content independently of the card's animated height.
    const nextHeight = content.getBoundingClientRect().height + cardInsets;
    const listTop = list.getBoundingClientRect().top;
    const timeline = gsap.timeline({
      defaults: { duration: 0.45, ease: "power3.inOut" },
      onComplete: () => setIsAnimating(false),
    });

    timeline.fromTo(card, { height: snapshot.height }, { height: nextHeight, duration: 0.5 }, 0);
    rows.forEach((row) => {
      const previousTop = snapshot.positions.get(row.dataset.requestId!);

      if (previousTop !== undefined) {
        // Invert the layout change, then slide the existing rows into place.
        timeline.fromTo(row, { y: previousTop - (row.getBoundingClientRect().top - listTop) }, { y: 0, clearProps: "transform" }, 0);
      } else {
        // The next queued row starts invisible below its final position.
        timeline.fromTo(row, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "opacity,transform" }, 0.08);
      }
    });

    const emptyMessage = content.querySelector('[role="status"]');
    if (emptyMessage) {
      timeline.fromTo(emptyMessage, { opacity: 0, y: 8 }, { opacity: 1, y: 0, clearProps: "opacity,transform" }, 0.08);
    }
    timeline.set(card, { clearProps: "height" });
  }, { scope: cardRef, dependencies: [requests] });

  function startApproval() {
    setIsAnimating(true);
  }

  function approveRequest(id: number) {
    const list = listRef.current;
    const card = cardRef.current;
    const row = list?.querySelector<HTMLLIElement>(`[data-request-id="${id}"]`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!list || !card || !row || reducedMotion) {
      onRemove(id);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    contextSafe(() => {
      gsap.to(row, {
        opacity: 0,
        y: -8,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          listSnapshotRef.current = {
            height: card.getBoundingClientRect().height,
            positions: new Map(Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li"), (item) => [item.dataset.requestId!, item.getBoundingClientRect().top - list.getBoundingClientRect().top])),
          };
          // Freeze the whole card before React changes its natural content size.
          gsap.set(card, { height: card.getBoundingClientRect().height });
          onRemove(id);
        },
      });
    })();
  }

  return { cardRef, contentRef, listRef, isAnimating, startApproval, approveRequest };
}
