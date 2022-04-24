import { PracticeLogModelAttributes } from "../model/practicelog";

export interface FindAllAndCountPracticeLogResult {
  count: number;
  rows: PracticeLogModelAttributes[];
}
