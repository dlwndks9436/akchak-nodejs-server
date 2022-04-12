import { FindAllAndCountPracticeResult } from "../../interfaces/Practice";
import getSignedS3URL from "./getSignedS3URL";

export const getPagingData = (
  data: FindAllAndCountPracticeResult,
  page: string | undefined,
  limit: number
) => {
  const { count: totalItems, rows: practices } = data;
  const currentPage = page ? +parseInt(page, 10) : 0;
  const totalPages = Math.ceil(totalItems / limit);
  const thumbnailURLs = new Array<string>(practices.length);
  practices.forEach((practice, index) => {
    const key = practice.s3_key
      .split(".")
      .map((val) => {
        if (val === "mp4") {
          return "jpg";
        }
        return val;
      })
      .join(".");
    const signedUrl = getSignedS3URL({
      bucket: process.env.BUCKET!,
      key,
    });
    thumbnailURLs[index] = signedUrl;
  });
  return { totalItems, practices, totalPages, currentPage, thumbnailURLs };
};
