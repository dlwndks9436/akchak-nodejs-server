import { sendMail } from "src/controllers/mailer";
import AuthCode from "src/model/authCode";
import makeAuthCode from "./makeAuthCode";

export const authCodeToEmail = async (
  userId: number,
  userEmail: string
): Promise<boolean> => {
  const authCode = makeAuthCode(6);
  try {
    const previousAuthCode = await AuthCode.findOne({
      where: { user_id: userId },
    });
    if (previousAuthCode) {
      await previousAuthCode.update({ code: authCode }).then(async () => {
        await sendMail(userEmail, authCode);
      });
    } else {
      await AuthCode.create({
        user_id: userId,
        code: authCode,
      }).then(async () => {
        await sendMail(userEmail, authCode);
      });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
