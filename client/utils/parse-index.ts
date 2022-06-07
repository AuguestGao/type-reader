export const parseIndex = (s: string) => {
  return s.split(",").map((idx) => parseInt(idx));
};
