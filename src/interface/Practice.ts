import { Attributes } from "sequelize/types";
import PracticeLog from "../models/practicelog";

export interface FindAllAndCountPracticeLogResult {
  count: number;
  rows: Attributes<PracticeLog>[];
}
