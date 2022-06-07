import { add } from "../parsing";

it("should return 2 when input 1 and 1", () => {
  const res = add(1, 1);
  expect(res).toBe(2);
});
