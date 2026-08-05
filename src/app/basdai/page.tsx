"use client";

import { AuthGate } from "@/components/AuthGate";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { BASDAI } from "@/lib/questions";

export default function BasdaiPage() {
  return (
    <AuthGate>
      <QuestionnaireForm instrument={BASDAI} />
    </AuthGate>
  );
}
