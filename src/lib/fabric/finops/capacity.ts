import { calculateCapacity } from "../../calculator";
import { EvaluationResponse } from "../../../types";

export function estimateCapacity(data: any): EvaluationResponse {
  // Leverage existing logic
  return calculateCapacity(data);
}
