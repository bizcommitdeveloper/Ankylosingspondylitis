"use client";

import { AuthGate } from "@/components/AuthGate";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";
import { BASFI } from "@/lib/questions";

export default function BasfiPage() {
  return (
    <AuthGate>
      <QuestionnaireForm instrument={BASFI} />
    </AuthGate>
  );
}
