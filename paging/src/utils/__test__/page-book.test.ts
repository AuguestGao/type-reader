import { pageBook } from "../page-book";

it("returns paragraphs", () => {
  let text = `Alice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\nAlice was\nbob is\n`;

  let res = pageBook([
    {
      pageIndex: 0,
      pageContent: [[text]],
    },
  ]);

  console.log(res);
  console.log(res[0].pageContent);
  // console.log(res[1].pageContent);

  expect(res!.length).toBeGreaterThan(0);
});
