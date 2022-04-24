import { sendMail } from "./sendMail";
import VerificationCode from "../../model/verificationCode";
import generateVerificationCode from "./generateVerificationCode";

export const verificationCodeToEmail = async (
  playerId: number,
  playerEmail: string
): Promise<boolean> => {
  const verificationCode = generateVerificationCode(6);
  try {
    const previousVerificationCode = await VerificationCode.findOne({
      where: { player_id: playerId },
    });
    if (previousVerificationCode) {
      await previousVerificationCode
        .update({ code: verificationCode })
        .then(async () => {
          await sendMail(playerEmail, verificationCode);
        });
    } else {
      await VerificationCode.create({
        player_id: playerId,
        code: verificationCode,
      }).then(async () => {
        await sendMail(playerEmail, verificationCode);
      });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
