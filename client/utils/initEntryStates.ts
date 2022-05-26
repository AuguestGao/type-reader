export const initEntryStates = ({
  pageIndex,
  pageContent,
}: {
  pageIndex: number;
  pageContent: string[];
}) => {
  // add entry states unread in the content array
  const entries = pageContent.map((char, charIndex) => ({
    char,
    pressedKey: "",
    state: "untyped",
    charIndex,
  }));

  return {
    pageIndex,
    entries,
  };
};
