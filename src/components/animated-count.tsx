"use client";

import { useAnimatedCount } from "@/hooks/use-animated-count";

type AnimatedCountProps = {
  value: number;
};

export function AnimatedCount({ value }: AnimatedCountProps) {
  const { countRef, previousRef, currentRef } = useAnimatedCount(value);

  return (
    <span ref={countRef} aria-hidden="true" className="relative inline-grid tabular-nums [perspective:160px]">
      <span ref={previousRef} className="invisible absolute inset-0 [backface-visibility:hidden]" />
      <span ref={currentRef} className="block [backface-visibility:hidden]">{value}</span>
    </span>
  );
}
