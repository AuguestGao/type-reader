export const regexList = {
  // whitespaces
  tab: { re: /[\t]/g, replacedBy: "↹" },
  // symbols
  double_quotes: { re: /[\u201C\u201D\u201E\u201F]/g, replacedBy: "”" },
  single_quotes: { re: /[\u2018\u2019\u201A\u201B]/g, replacedBy: "'" },
  double_left_guillemet: { re: /[\u00AB]/g, replacedBy: "<<" }, // «
  double_right_guillemet: { re: /[\u00BB]/g, replacedBy: ">>" }, // »
  single_left_guillemet: { re: /[\u2039]/g, replacedBy: "<" }, // ‹
  single_right_guillemet: { re: /[\u203A]/g, replacedBy: ">" }, // ›
  single_dash: { re: /[\u2011-\u2015\uFE58\uFE63\uFF0D]/g, replacedBy: "-" },
  double_dash: { re: /[\u2E3A]/g, replacedBy: "--" },
  triple_dash: { re: /[\u2E3B]/g, replacedBy: "---" },
};
