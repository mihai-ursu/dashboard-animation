"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

type UseAnimatedApprovalButtonOptions = {
  onApprove: () => void;
  onStart: () => void;
};

export function useAnimatedApprovalButton({ onApprove, onStart }: UseAnimatedApprovalButtonOptions) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const [isDone, setIsDone] = useState(false);
  const { contextSafe } = useGSAP({ scope: buttonRef });

  function handleApprove() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    const initialBackground = window.getComputedStyle(buttonRef.current!).backgroundColor;
    setIsDone(true);
    onStart();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    contextSafe(() => {
      gsap.timeline()
        .fromTo(buttonRef.current, { backgroundColor: initialBackground }, { backgroundColor: "#16A34A", duration: reducedMotion ? 0 : 0.28, clearProps: "backgroundColor" }, 0)
        .fromTo("[data-approval-label]", { opacity: 1, y: 0 }, { opacity: 0, y: reducedMotion ? 0 : -6, duration: reducedMotion ? 0 : 0.16 }, 0)
        .fromTo("[data-done-label]", { opacity: 0, y: reducedMotion ? 0 : 6 }, { opacity: 1, y: 0, duration: reducedMotion ? 0 : 0.22, ease: "power2.out" }, reducedMotion ? 0 : 0.12)
        .fromTo("[data-done-check]", { scale: reducedMotion ? 1 : 0.6 }, { scale: 1, duration: reducedMotion ? 0 : 0.25, ease: "back.out(2)" }, reducedMotion ? 0 : 0.18)
        // Keep the confirmation visible before the row exits.
        .call(onApprove, [], "+=0.65");
    })();
  }

  return { buttonRef, isDone, handleApprove };
}
