import { PracticeModelAttributes } from "../model/practice";

export interface FindAllAndCountPracticeResult {
  count: number;
  rows: PracticeModelAttributes[];
}
