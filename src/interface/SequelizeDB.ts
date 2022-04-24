import { Sequelize } from "sequelize/types";
import Book from "src/model/book";
import Goal from "src/model/goal";
import JWTToken from "src/model/jwtToken";
import Like from "src/model/like";
import Music from "src/model/music";
import Phrase from "src/model/phrase";
import Player from "src/model/player";
import PracticeLog from "src/model/practicelog";
import Subject from "src/model/subject";
import VerificationCode from "src/model/verificationCode";
import Video from "src/model/video";

export interface SequelizeDB {
  sequelize?: Sequelize;
  Book?: Book;
  Goal?: Goal;
  JWTToken?: JWTToken;
  Like?: Like;
  Music?: Music;
  Phrase?: Phrase;
  Player?: Player;
  Practicelog?: PracticeLog;
  Subject?: Subject;
  VerificationCode?: VerificationCode;
  Video?: Video;
}
