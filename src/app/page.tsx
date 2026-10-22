import { DecisionCard } from "@/components/decision-card";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center bg-[#F4F6FA] px-4 py-12 font-[Arial,Helvetica,sans-serif] sm:px-6 lg:px-8">
      <h1 className="sr-only">Dashboard before and after comparison</h1>
      <div className="grid w-full max-w-[1520px] grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-6">
        <DecisionCard version="Before" />
        <DecisionCard version="After" />
      </div>
    </main>
  );
}
