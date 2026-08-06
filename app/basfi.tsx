import { QuestionnaireForm } from "../components/QuestionnaireForm";
import { BASFI } from "../lib/questions";

export default function BasfiScreen() {
  return <QuestionnaireForm instrument={BASFI} />;
}
