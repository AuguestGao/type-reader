import { pageBook } from "../page-book";

it("returns paragraphs", () => {
  let text = "11\n1\n111";

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
