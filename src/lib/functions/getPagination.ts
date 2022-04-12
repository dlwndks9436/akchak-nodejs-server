export const getPagination = (
  page: string | undefined,
  size: string | undefined
) => {
  const limit = size ? +parseInt(size, 10) : 10;
  const offset = page ? parseInt(page, 10) * limit : 0;
  return { limit, offset };
};
