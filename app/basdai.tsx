import { QuestionnaireForm } from "../components/QuestionnaireForm";
import { BASDAI } from "../lib/questions";

export default function BasdaiScreen() {
  return <QuestionnaireForm instrument={BASDAI} />;
}
