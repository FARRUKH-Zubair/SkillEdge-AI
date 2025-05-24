"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import InterviewSimulator from "@/components/InterviewSimulator/InterviewSimulator";

function InterviewSimulatorContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  return <InterviewSimulator type={type} />;
}

export default function InterviewSimulatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewSimulatorContent />
    </Suspense>
  );
}
