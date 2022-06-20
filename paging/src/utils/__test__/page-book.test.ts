import { pageBook } from "../page-book";

it("returns paragraphs", () => {
  let text =
    "Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; “and even if my head would go through,” thought poor Alice, “it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin.” For, you see, so many out-of-the-way things had happened lately, that Alice had begun to think that very few things indeed were really impossible.";

  let res = pageBook([
    {
      pageIndex: 0,
      pageContent: [[text]],
    },
  ]);

  // console.log(res);
  // console.log(res[14].pageContent);
  // console.log(res.length);

  expect(res!.length).toBeGreaterThan(0);
});
