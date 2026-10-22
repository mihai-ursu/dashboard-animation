"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function useAnimatedCount(value: number) {
  const countRef = useRef<HTMLSpanElement>(null);
  const previousRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef(value);

  useGSAP(() => {
    const previous = previousRef.current;
    const current = currentRef.current;
    const previousValue = previousValueRef.current;
    previousValueRef.current = value;

    if (!previous || !current || previousValue === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    previous.textContent = String(previousValue);

    gsap.timeline()
      .set(previous, { autoAlpha: 1, rotationX: 0 })
      .set(current, { autoAlpha: 0, rotationX: 90 }, 0)
      .to(previous, { rotationX: -90, duration: 0.18, ease: "power2.in" })
      .set(previous, { autoAlpha: 0 })
      .to(current, { autoAlpha: 1, rotationX: 0, duration: 0.3, ease: "power3.out", clearProps: "all" });
  }, { scope: countRef, dependencies: [value], revertOnUpdate: true });

  return { countRef, previousRef, currentRef };
}
